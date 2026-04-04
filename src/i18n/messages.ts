import type { Locale } from './locale'

export type NavigationKey =
  | 'home'
  | 'library'
  | 'games'
  | 'optimizations'
  | 'tools'
  | 'presets'
  | 'diagnostics'
  | 'settings'
  | 'credits'

type PageCopy = {
  eyebrow: string
  title: string
  subtitle: string
}

export interface MessageCatalog {
  hardware: {
    statuses: {
      detected: string
      overridden: string
      unavailable: string
    }
  }
  shell: {
    brandSubtitle: string
    navigationLabel: string
    links: Record<NavigationKey, string>
  }
  locales: Record<Locale, string>
  pages: {
    home: PageCopy & {
      statusCardTitle: string
      statusConnecting: string
      statusReady: string
      statusError: string
      backendErrorSummary: string
      commanderName: string
      hardwareSummary: {
        title: string
        cpu: string
        gpu: string
        memory: string
        display: string
      }
      fields: {
        greeting: string
        app: string
        platform: string
      }
    }
    library: PageCopy
    games: PageCopy
    optimizations: PageCopy
    tools: PageCopy
    presets: PageCopy
    diagnostics: PageCopy & {
      hardware: {
        cards: {
          cpu: string
          gpu: string
          memory: string
          display: string
        }
        fields: {
          model: string
          physicalCores: string
          logicalThreads: string
          vendor: string
          vram: string
          totalRam: string
          adapter: string
          monitor: string
          resolution: string
          refreshRate: string
          source: string
        }
        override: {
          useManual: string
          width: string
          height: string
          refreshRate: string
          apply: string
          reset: string
        }
      }
    }
    settings: PageCopy & {
      languageCardTitle: string
      languageCardDescription: string
      languageLabel: string
    }
    credits: PageCopy & {
      notes: [string, string]
    }
  }
}

export const messages: Record<Locale, MessageCatalog> = {
  en: {
    hardware: {
      statuses: {
        detected: 'Detected',
        overridden: 'Manual override active',
        unavailable: 'Unavailable',
      },
    },
    shell: {
      brandSubtitle: 'Launcher-grade control',
      navigationLabel: 'Primary navigation',
      links: {
        home: 'Home',
        library: 'Library',
        games: 'Games',
        optimizations: 'Optimizations',
        tools: 'Tools',
        presets: 'Presets',
        diagnostics: 'Diagnostics',
        settings: 'Settings',
        credits: 'Credits',
      },
    },
    locales: {
      en: 'English',
      'pt-BR': 'Português (Brasil)',
    },
    pages: {
      home: {
        eyebrow: 'Home',
        title: 'Welcome to OptiHub',
        subtitle: 'Your PC game optimization hub',
        statusCardTitle: 'IPC Status',
        statusConnecting: 'Connecting...',
        statusReady: 'Backend connected',
        statusError: 'Backend offline',
        backendErrorSummary: 'The desktop backend could not be reached',
        commanderName: 'Commander',
        hardwareSummary: {
          title: 'Hardware Summary',
          cpu: 'CPU',
          gpu: 'GPU',
          memory: 'Memory',
          display: 'Display',
        },
        fields: {
          greeting: 'Greeting',
          app: 'App',
          platform: 'Platform',
        },
      },
      library: {
        eyebrow: 'Library',
        title: 'Game Library',
        subtitle: 'Your detected and added games will appear here',
      },
      games: {
        eyebrow: 'Games',
        title: 'Games',
        subtitle: 'Browse and manage your game collection',
      },
      optimizations: {
        eyebrow: 'Optimizations',
        title: 'Optimizations',
        subtitle: 'Active and available optimizations',
      },
      tools: {
        eyebrow: 'Tools',
        title: 'Tools',
        subtitle: 'Detected optimization tools and their status',
      },
      presets: {
        eyebrow: 'Presets',
        title: 'Presets',
        subtitle: 'Quality, Balanced, and Performance presets',
      },
      diagnostics: {
        eyebrow: 'Diagnostics',
        title: 'Diagnostics',
        subtitle: 'System hardware and diagnostics overview',
        hardware: {
          cards: {
            cpu: 'CPU',
            gpu: 'GPU',
            memory: 'Memory',
            display: 'Display',
          },
          fields: {
            model: 'Model',
            physicalCores: 'Physical cores',
            logicalThreads: 'Logical threads',
            vendor: 'Vendor',
            vram: 'VRAM',
            totalRam: 'Total RAM',
            adapter: 'Adapter',
            monitor: 'Monitor',
            resolution: 'Resolution',
            refreshRate: 'Refresh rate',
            source: 'Source',
          },
          override: {
            useManual: 'Use manual override',
            width: 'Width',
            height: 'Height',
            refreshRate: 'Refresh rate',
            apply: 'Apply override',
            reset: 'Reset to detected',
          },
        },
      },
      settings: {
        eyebrow: 'Settings',
        title: 'Settings',
        subtitle: 'Configure OptiHub preferences',
        languageCardTitle: 'Application language',
        languageCardDescription:
          'Choose the language used across the navigation, shell, and status copy.',
        languageLabel: 'Application language',
      },
      credits: {
        eyebrow: 'Credits',
        title: 'Credits & Licenses',
        subtitle: 'OptiHub uses the following open-source projects and tools',
        notes: [
          'Full credits, licenses, and attribution information will be listed here.',
          'OptiHub is committed to proper licensing and attribution for all integrated tools.',
        ],
      },
    },
  },
  'pt-BR': {
    hardware: {
      statuses: {
        detected: 'Detectado',
        overridden: 'Override manual ativo',
        unavailable: 'Indisponível',
      },
    },
    shell: {
      brandSubtitle: 'Controle no nível de launcher',
      navigationLabel: 'Navegação principal',
      links: {
        home: 'Início',
        library: 'Biblioteca',
        games: 'Jogos',
        optimizations: 'Otimizações',
        tools: 'Ferramentas',
        presets: 'Presets',
        diagnostics: 'Diagnósticos',
        settings: 'Configurações',
        credits: 'Créditos',
      },
    },
    locales: {
      en: 'English',
      'pt-BR': 'Português (Brasil)',
    },
    pages: {
      home: {
        eyebrow: 'Início',
        title: 'Bem-vindo ao OptiHub',
        subtitle: 'Seu hub de otimização de jogos para PC',
        statusCardTitle: 'Status do IPC',
        statusConnecting: 'Conectando...',
        statusReady: 'Backend conectado',
        statusError: 'Backend indisponível',
        backendErrorSummary: 'Não foi possível alcançar o backend desktop',
        commanderName: 'Comandante',
        hardwareSummary: {
          title: 'Resumo de Hardware',
          cpu: 'CPU',
          gpu: 'GPU',
          memory: 'Memória',
          display: 'Display',
        },
        fields: {
          greeting: 'Saudação',
          app: 'Aplicativo',
          platform: 'Plataforma',
        },
      },
      library: {
        eyebrow: 'Biblioteca',
        title: 'Biblioteca de Jogos',
        subtitle: 'Seus jogos detectados e adicionados aparecerão aqui',
      },
      games: {
        eyebrow: 'Jogos',
        title: 'Jogos',
        subtitle: 'Navegue e gerencie sua coleção de jogos',
      },
      optimizations: {
        eyebrow: 'Otimizações',
        title: 'Otimizações',
        subtitle: 'Otimizações ativas e disponíveis',
      },
      tools: {
        eyebrow: 'Ferramentas',
        title: 'Ferramentas',
        subtitle: 'Ferramentas de otimização detectadas e seu status',
      },
      presets: {
        eyebrow: 'Presets',
        title: 'Presets',
        subtitle: 'Presets de Qualidade, Balanceado e Performance',
      },
      diagnostics: {
        eyebrow: 'Diagnósticos',
        title: 'Diagnósticos',
        subtitle: 'Visão geral do hardware e dos diagnósticos do sistema',
        hardware: {
          cards: {
            cpu: 'CPU',
            gpu: 'GPU',
            memory: 'Memória',
            display: 'Display',
          },
          fields: {
            model: 'Modelo',
            physicalCores: 'Núcleos físicos',
            logicalThreads: 'Threads lógicas',
            vendor: 'Fabricante',
            vram: 'VRAM',
            totalRam: 'RAM total',
            adapter: 'Adaptador',
            monitor: 'Monitor',
            resolution: 'Resolução',
            refreshRate: 'Taxa de atualização',
            source: 'Origem',
          },
          override: {
            useManual: 'Usar override manual',
            width: 'Largura',
            height: 'Altura',
            refreshRate: 'Taxa de atualização',
            apply: 'Aplicar override',
            reset: 'Voltar ao detectado',
          },
        },
      },
      settings: {
        eyebrow: 'Configurações',
        title: 'Configurações',
        subtitle: 'Configure as preferências do OptiHub',
        languageCardTitle: 'Idioma do aplicativo',
        languageCardDescription:
          'Escolha o idioma usado na navegação, no shell e nas mensagens de status.',
        languageLabel: 'Idioma do aplicativo',
      },
      credits: {
        eyebrow: 'Créditos',
        title: 'Créditos e Licenças',
        subtitle: 'O OptiHub usa os seguintes projetos e ferramentas de código aberto',
        notes: [
          'Os créditos completos, licenças e atribuições serão listados aqui.',
          'O OptiHub se compromete com o licenciamento e a atribuição corretos de todas as ferramentas integradas.',
        ],
      },
    },
  },
}
