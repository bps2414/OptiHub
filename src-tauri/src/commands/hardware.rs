use serde::{Deserialize, Serialize};
use sysinfo::System;
use windows::Win32::Graphics::Dxgi::{CreateDXGIFactory1, DXGI_ADAPTER_DESC1, IDXGIFactory1};
use windows::Win32::Graphics::Gdi::{
    DEVMODEW, DISPLAY_DEVICE_ATTACHED_TO_DESKTOP, DISPLAY_DEVICEW, ENUM_CURRENT_SETTINGS,
    EnumDisplayDevicesW, EnumDisplaySettingsW,
};
use windows::core::PCWSTR;
use wmi::WMIConnection;

use crate::errors::AppError;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CpuSnapshot {
    pub model: Option<String>,
    pub physical_cores: Option<u32>,
    pub logical_threads: Option<u32>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GpuSnapshot {
    pub model: Option<String>,
    pub vendor: Option<String>,
    pub vram_bytes: Option<u64>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemorySnapshot {
    pub total_bytes: Option<u64>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DisplaySnapshot {
    pub adapter_name: Option<String>,
    pub monitor_name: Option<String>,
    pub width_px: Option<u32>,
    pub height_px: Option<u32>,
    pub refresh_hz: Option<f64>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HardwareSnapshot {
    pub cpu: CpuSnapshot,
    pub gpu: GpuSnapshot,
    pub memory: MemorySnapshot,
    pub display: DisplaySnapshot,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "PascalCase")]
struct VideoControllerRow {
    name: Option<String>,
    adapter_compatibility: Option<String>,
    adapter_ram: Option<u64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct DxgiAdapterInfo {
    description: Option<String>,
    dedicated_video_memory: Option<u64>,
}

fn normalize_optional_string(value: Option<&str>) -> Option<String> {
    value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToOwned::to_owned)
}

fn normalize_monitor_name(value: Option<&str>) -> Option<String> {
    let normalized = normalize_optional_string(value)?;
    let lowered = normalized.to_ascii_lowercase();

    if lowered.contains("generic pnp")
        || lowered.contains("monitor padrão")
        || lowered.contains("monitor padrao")
        || lowered == "generic monitor"
    {
        return None;
    }

    Some(normalized)
}

fn normalize_vendor(value: Option<&str>, model: Option<&str>) -> Option<String> {
    let direct = normalize_optional_string(value);

    if direct.is_some() {
        return direct;
    }

    let normalized_model = model?.trim().to_ascii_lowercase();

    if normalized_model.contains("nvidia") {
        return Some("NVIDIA".into());
    }

    if normalized_model.contains("amd") || normalized_model.contains("radeon") {
        return Some("AMD".into());
    }

    if normalized_model.contains("intel") {
        return Some("Intel".into());
    }

    if normalized_model.contains("microsoft") {
        return Some("Microsoft".into());
    }

    None
}

fn build_cpu_snapshot(
    model: Option<&str>,
    physical_cores: Option<u32>,
    logical_threads: Option<u32>,
) -> CpuSnapshot {
    CpuSnapshot {
        model: normalize_optional_string(model),
        physical_cores,
        logical_threads,
    }
}

fn normalize_gpu_snapshot(
    rows: &[VideoControllerRow],
    dxgi_adapter: Option<&DxgiAdapterInfo>,
) -> GpuSnapshot {
    let best_row = rows
        .iter()
        .max_by_key(|row| {
            let has_name = normalize_optional_string(row.name.as_deref()).is_some() as u8;
            let has_vram = row.adapter_ram.is_some() as u8;
            let not_basic_driver = (!row
                .name
                .as_deref()
                .unwrap_or_default()
                .to_ascii_lowercase()
                .contains("basic render")) as u8;

            (has_name, has_vram, not_basic_driver)
        });

    match best_row {
        Some(row) => GpuSnapshot {
            model: dxgi_adapter
                .and_then(|adapter| normalize_optional_string(adapter.description.as_deref()))
                .or_else(|| normalize_optional_string(row.name.as_deref())),
            vendor: normalize_vendor(
                row.adapter_compatibility.as_deref(),
                dxgi_adapter
                    .and_then(|adapter| adapter.description.as_deref())
                    .or(row.name.as_deref()),
            ),
            vram_bytes: dxgi_adapter
                .and_then(|adapter| adapter.dedicated_video_memory.filter(|value| *value > 0))
                .or_else(|| row.adapter_ram.filter(|value| *value > 0)),
        },
        None => GpuSnapshot {
            model: dxgi_adapter
                .and_then(|adapter| normalize_optional_string(adapter.description.as_deref())),
            vendor: normalize_vendor(
                None,
                dxgi_adapter.and_then(|adapter| adapter.description.as_deref()),
            ),
            vram_bytes: dxgi_adapter
                .and_then(|adapter| adapter.dedicated_video_memory.filter(|value| *value > 0)),
        },
    }
}

fn build_display_snapshot(
    adapter_name: Option<&str>,
    monitor_name: Option<&str>,
    width_px: Option<u32>,
    height_px: Option<u32>,
    refresh_hz: Option<u32>,
) -> DisplaySnapshot {
    DisplaySnapshot {
        adapter_name: normalize_optional_string(adapter_name),
        monitor_name: normalize_monitor_name(monitor_name),
        width_px: width_px.filter(|value| *value > 0),
        height_px: height_px.filter(|value| *value > 0),
        refresh_hz: refresh_hz.filter(|value| *value > 0).map(f64::from),
    }
}

fn wide_to_string(buffer: &[u16]) -> Option<String> {
    let length = buffer.iter().position(|value| *value == 0).unwrap_or(buffer.len());

    if length == 0 {
        return None;
    }

    Some(String::from_utf16_lossy(&buffer[..length]))
}

fn detect_cpu_snapshot() -> CpuSnapshot {
    let system = System::new_all();
    let model = system.cpus().first().map(|cpu| cpu.brand());
    let physical_cores = System::physical_core_count().map(|count| count as u32);
    let logical_threads = Some(system.cpus().len() as u32);

    build_cpu_snapshot(model, physical_cores, logical_threads)
}

fn detect_memory_snapshot() -> MemorySnapshot {
    let system = System::new_all();

    MemorySnapshot {
        total_bytes: Some(system.total_memory()).filter(|value| *value > 0),
    }
}

fn detect_gpu_snapshot() -> GpuSnapshot {
    let dxgi_adapter = detect_dxgi_adapter_info();
    let rows = WMIConnection::new()
        .and_then(|connection| {
            connection.raw_query::<VideoControllerRow>(
                "SELECT Name, AdapterCompatibility, AdapterRAM FROM Win32_VideoController",
            )
        })
        .unwrap_or_default();

    normalize_gpu_snapshot(&rows, dxgi_adapter.as_ref())
}

fn detect_dxgi_adapter_info() -> Option<DxgiAdapterInfo> {
    let factory = unsafe { CreateDXGIFactory1::<IDXGIFactory1>() }.ok()?;
    let mut adapters = Vec::new();
    let mut index = 0;

    loop {
        let adapter = unsafe { factory.EnumAdapters1(index) };

        match adapter {
            Ok(adapter) => {
                if let Ok(description) = unsafe { adapter.GetDesc1() } {
                    adapters.push(dxgi_description_to_info(&description));
                }

                index += 1;
            }
            Err(_) => break,
        }
    }

    select_best_dxgi_adapter(&adapters)
}

fn dxgi_description_to_info(description: &DXGI_ADAPTER_DESC1) -> DxgiAdapterInfo {
    DxgiAdapterInfo {
        description: wide_to_string(&description.Description),
        dedicated_video_memory: Some(description.DedicatedVideoMemory as u64)
            .filter(|value| *value > 0),
    }
}

fn select_best_dxgi_adapter(adapters: &[DxgiAdapterInfo]) -> Option<DxgiAdapterInfo> {
    adapters
        .iter()
        .cloned()
        .max_by_key(|adapter| {
            let has_name = adapter.description.is_some() as u8;
            let dedicated_memory = adapter.dedicated_video_memory.unwrap_or_default();
            (has_name, dedicated_memory)
        })
}

fn detect_display_snapshot() -> DisplaySnapshot {
    let mut device_index = 0;

    loop {
        let mut adapter = DISPLAY_DEVICEW::default();
        adapter.cb = size_of::<DISPLAY_DEVICEW>() as u32;

        let found_adapter =
            unsafe { EnumDisplayDevicesW(PCWSTR::null(), device_index, &mut adapter, 0) }
                .as_bool();

        if !found_adapter {
            break;
        }

        device_index += 1;

        if adapter.StateFlags & DISPLAY_DEVICE_ATTACHED_TO_DESKTOP
            != DISPLAY_DEVICE_ATTACHED_TO_DESKTOP
        {
            continue;
        }

        let adapter_device_name = PCWSTR(adapter.DeviceName.as_ptr());
        let adapter_name = wide_to_string(&adapter.DeviceString);

        let mut monitor = DISPLAY_DEVICEW::default();
        monitor.cb = size_of::<DISPLAY_DEVICEW>() as u32;

        let monitor_name =
            if unsafe { EnumDisplayDevicesW(adapter_device_name, 0, &mut monitor, 0) }.as_bool() {
                wide_to_string(&monitor.DeviceString)
            } else {
                None
            };

        let mut mode = DEVMODEW::default();
        mode.dmSize = size_of::<DEVMODEW>() as u16;

        if unsafe { EnumDisplaySettingsW(adapter_device_name, ENUM_CURRENT_SETTINGS, &mut mode) }
            .as_bool()
        {
            return build_display_snapshot(
                adapter_name.as_deref(),
                monitor_name.as_deref(),
                Some(mode.dmPelsWidth),
                Some(mode.dmPelsHeight),
                Some(mode.dmDisplayFrequency),
            );
        }

        return build_display_snapshot(
            adapter_name.as_deref(),
            monitor_name.as_deref(),
            None,
            None,
            None,
        );
    }

    build_display_snapshot(None, None, None, None, None)
}

#[tauri::command]
pub async fn get_hardware_snapshot() -> Result<HardwareSnapshot, AppError> {
    Ok(HardwareSnapshot {
        cpu: detect_cpu_snapshot(),
        gpu: detect_gpu_snapshot(),
        memory: detect_memory_snapshot(),
        display: detect_display_snapshot(),
    })
}

#[cfg(test)]
mod tests {
    use windows::Win32::Graphics::Dxgi::DXGI_ADAPTER_DESC1;

    use super::{
        build_cpu_snapshot, build_display_snapshot, dxgi_description_to_info,
        normalize_gpu_snapshot, normalize_monitor_name, select_best_dxgi_adapter,
        DxgiAdapterInfo, VideoControllerRow,
    };

    #[test]
    fn cpu_snapshot_uses_physical_core_count_when_available() {
        let snapshot = build_cpu_snapshot(Some("AMD Ryzen 7 5800X"), Some(8), Some(16));

        assert_eq!(snapshot.model.as_deref(), Some("AMD Ryzen 7 5800X"));
        assert_eq!(snapshot.physical_cores, Some(8));
        assert_eq!(snapshot.logical_threads, Some(16));
    }

    #[test]
    fn gpu_normalization_prefers_row_with_name_and_vram() {
        let snapshot = normalize_gpu_snapshot(
            &[
            VideoControllerRow {
                name: Some("Microsoft Basic Render Driver".into()),
                adapter_compatibility: Some("Microsoft".into()),
                adapter_ram: None,
            },
            VideoControllerRow {
                name: Some("NVIDIA GeForce RTX 4070".into()),
                adapter_compatibility: Some("NVIDIA".into()),
                adapter_ram: Some(12_884_901_888),
            },
            ],
            None,
        );

        assert_eq!(snapshot.model.as_deref(), Some("NVIDIA GeForce RTX 4070"));
        assert_eq!(snapshot.vendor.as_deref(), Some("NVIDIA"));
        assert_eq!(snapshot.vram_bytes, Some(12_884_901_888));
    }

    #[test]
    fn gpu_normalization_prefers_dedicated_video_memory_over_adapter_ram() {
        let snapshot = normalize_gpu_snapshot(
            &[VideoControllerRow {
                name: Some("AMD Radeon RX 6600".into()),
                adapter_compatibility: Some("Advanced Micro Devices, Inc.".into()),
                adapter_ram: Some(4_293_918_720),
            }],
            Some(&DxgiAdapterInfo {
                description: Some("AMD Radeon RX 6600".into()),
                dedicated_video_memory: Some(8_589_934_592),
            }),
        );

        assert_eq!(snapshot.model.as_deref(), Some("AMD Radeon RX 6600"));
        assert_eq!(snapshot.vram_bytes, Some(8_589_934_592));
    }

    #[test]
    fn display_snapshot_returns_none_for_missing_mode_values() {
        let snapshot = build_display_snapshot(
            Some("\\\\.\\DISPLAY1"),
            Some("Generic PnP Monitor"),
            None,
            None,
            None,
        );

        assert_eq!(snapshot.adapter_name.as_deref(), Some("\\\\.\\DISPLAY1"));
        assert_eq!(snapshot.monitor_name, None);
        assert_eq!(snapshot.width_px, None);
        assert_eq!(snapshot.height_px, None);
        assert_eq!(snapshot.refresh_hz, None);
    }

    #[test]
    fn normalize_monitor_name_hides_generic_monitor_labels() {
        assert_eq!(normalize_monitor_name(Some("Generic PnP Monitor")), None);
        assert_eq!(normalize_monitor_name(Some("Monitor Padrão")), None);
        assert_eq!(normalize_monitor_name(Some("LG ULTRAGEAR")), Some("LG ULTRAGEAR".into()));
    }

    #[test]
    fn dxgi_description_extracts_friendly_name_and_vram() {
        let mut description = DXGI_ADAPTER_DESC1::default();
        let encoded: Vec<u16> = "AMD Radeon RX 6600".encode_utf16().collect();

        for (index, value) in encoded.iter().enumerate() {
            description.Description[index] = *value;
        }

        description.DedicatedVideoMemory = 8_589_934_592usize;

        let adapter = dxgi_description_to_info(&description);

        assert_eq!(adapter.description.as_deref(), Some("AMD Radeon RX 6600"));
        assert_eq!(adapter.dedicated_video_memory, Some(8_589_934_592));
    }

    #[test]
    fn select_best_dxgi_adapter_prefers_larger_dedicated_memory() {
        let adapter = select_best_dxgi_adapter(&[
            DxgiAdapterInfo {
                description: Some("Virtual Adapter".into()),
                dedicated_video_memory: Some(536_870_912),
            },
            DxgiAdapterInfo {
                description: Some("AMD Radeon RX 6600".into()),
                dedicated_video_memory: Some(8_589_934_592),
            },
        ]);

        assert_eq!(
            adapter.and_then(|value| value.description),
            Some("AMD Radeon RX 6600".into())
        );
    }
}
