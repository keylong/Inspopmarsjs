export default {
  // Site information
  site: {
    title: 'Descargador de Instagram',
  },

  // Common UI elements
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    close: 'Cerrar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    download: 'Descargar',
    upload: 'Subir',
    share: 'Compartir',
    copy: 'Copiar',
    copied: 'Copiado',
    language: 'Idioma',
  },

  // Navigation
  nav: {
    home: 'Inicio',
    download: 'Descargar',
    profile: 'Perfil',
    settings: 'Configuración',
    about: 'Acerca de',
    help: 'Ayuda',
    contact: 'Contacto',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    dashboard: 'Panel',
  },

  // Auth pages
  auth: {
    signin: {
      title: 'Iniciar sesión',
      subtitle: '¡Bienvenido de nuevo! Por favor ingresa tus datos de acceso',
      email: 'Dirección de correo electrónico',
      password: 'Contraseña',
      remember: 'Recordarme',
      forgot: '¿Olvidaste tu contraseña?',
      submit: 'Iniciar sesión',
      noAccount: '¿No tienes una cuenta?',
      createAccount: 'Crear cuenta',
      emailPlaceholder: 'Ingresa tu dirección de correo electrónico',
      passwordPlaceholder: 'Ingresa tu contraseña',
    },
    signup: {
      title: 'Registrarse',
      subtitle: 'Crea tu nueva cuenta',
      name: 'Nombre completo',
      email: 'Dirección de correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      terms: 'Acepto los',
      termsLink: 'Términos del servicio',
      privacy: 'Política de privacidad',
      submit: 'Crear cuenta',
      hasAccount: '¿Ya tienes una cuenta?',
      signIn: 'Iniciar sesión',
      namePlaceholder: 'Ingresa tu nombre completo',
      emailPlaceholder: 'Ingresa tu dirección de correo electrónico',
      passwordPlaceholder: 'Ingresa tu contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
    },
    errors: {
      invalidCredentials: 'Email o contraseña incorrectos',
      loginFailed: 'Error de inicio de sesión, inténtalo de nuevo',
      registrationFailed: 'Falló el registro',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      registrationSuccess: '¡Registro exitoso! Iniciando sesión automáticamente...',
      autoLoginFailed: 'Registro exitoso pero el inicio automático falló, inicia sesión manualmente',
      loggingIn: 'Iniciando sesión...',
      registering: 'Creando cuenta...',
      loginWithAccount: 'Inicia sesión en tu cuenta',
      passwordHint: '(al menos 6 caracteres)',
      or: 'O'
    }
  },

  // Download page
  download: {
    title: 'Software de descarga de Instagram',
    subtitle: 'Descarga rápidamente fotos, videos, Stories e IGTV de Instagram',
    urlLabel: 'URL de Instagram',
    urlPlaceholder: 'Pega el enlace de Instagram aquí...',
    downloadButton: 'Descargar ahora',
    supportedTypes: 'Tipos compatibles',
    photos: 'Fotos',
    videos: 'Videos',
    stories: 'Stories',
    igtv: 'IGTV',
    reels: 'Reels',
    highlights: 'Destacadas',
    howTo: 'Cómo usar',
    step1: 'Copia el enlace del contenido de Instagram',
    step2: 'Pégalo en el cuadro de entrada superior',
    step3: 'Haz clic en el botón de descarga',
    step4: 'Espera el procesamiento y la descarga',
    features: {
      title: 'Características',
      highQuality: 'Alta calidad',
      highQualityDesc: 'Descarga fotos y videos originales de alta definición',
      noWatermark: 'Sin marca de agua',
      noWatermarkDesc: 'El contenido descargado no contiene marcas de agua',
      fastSpeed: 'Descarga rápida',
      fastSpeedDesc: 'Motor de descarga optimizado garantiza descargas rápidas',
      allFormats: 'Todos los formatos',
      allFormatsDesc: 'Soporte para todos los formatos de contenido de Instagram',
    },
    // Página de resultados de descarga
    result: {
      completed: 'Descarga Completada',
      downloadFailed: 'Descarga Fallida',
      retryDownload: 'Reintentar Descarga',
      errorCode: 'Código de Error',
      mediaDownload: 'Descarga de Medios',
      selectResolution: 'Seleccionar Resolución',
      preview: 'Vista Previa',
      copyFailed: 'Copia Fallida',
      downloadAll: 'Descargar Todo',
      downloadOptions: 'opciones de descarga, tamaño total aproximadamente',
      mediaFiles: 'archivos multimedia',
      totalSize: 'Tamaño total',
      carousel: 'Carrusel',
      multiMedia: 'Multi-media',
      original: 'Original',
      video: 'Video',
      image: 'Imagen',
      videoContent: 'Contenido de Video',
      imageContent: 'Contenido de Imagen',
      resolutions: 'resoluciones',
      post: 'Publicación',
      story: 'Historia',
      reel: 'Reels',
      igtv: 'IGTV',
      highlight: 'Destacado',
      content: 'Contenido',
      trustedUsers: 'Usuarios Confían en Nosotros',
      totalDownloads: 'Descargas',
      rating: 'Calificación',
      extremeSpeed: 'Velocidad Extrema',
      pureNoWatermark: 'Puro Sin Marca de Agua',
      fullFormatSupport: 'Soporte Completo de Formatos',
      supportedContent: 'Soporta descargar todo el contenido de Instagram',
      photoPosts: 'Publicaciones de Fotos',
      videoContent2: 'Contenido de Video',
      stories: 'Stories',
      reels: 'Reels',
    },
    // Formulario de descarga
    form: {
      urlLabel: 'URL de Instagram',
      urlPlaceholder: 'Pega el enlace de Instagram aquí...',
      urlRequired: 'Por favor ingresa el enlace de Instagram',
      urlInvalid: 'Por favor ingresa una URL válida',
      urlInvalidInstagram: 'Por favor ingresa un enlace válido de Instagram',
      urlValidationFailed: 'Falló la validación de URL',
      downloadFailed: 'Descarga fallida',
      downloading: 'Descargando...',
      startDownload: 'Iniciar Descarga',
      detected: 'Detectado',
      advancedOptions: 'Opciones Avanzadas',
      contentType: 'Tipo de Contenido',
      quality: 'Calidad',
      downloadFormat: 'Formato de Descarga',
      supportedTypes: 'Tipos de contenido soportados:',
      autoDetect: 'Detección Automática',
      originalQuality: 'Calidad Original',
      hdQuality: 'Alta Definición',
      sdQuality: 'Definición Estándar',
      individualFiles: 'Archivos Individuales',
      zipArchive: 'Archivo ZIP',
      posts: '📷 Publicaciones',
      videos: '📹 Videos',
      stories2: '⭐ Historias',
      highlights2: '✨ Destacados',
      unknownType: 'Tipo Desconocido',
      profileType: 'Perfil',
      optimizedTool: 'Herramienta',
      contentDownloader: 'Descargador de Contenido de Instagram',
    },
  },

  // Profile page
  profile: {
    title: 'Perfil',
    editProfile: 'Editar perfil',
    name: 'Nombre',
    email: 'Correo electrónico',
    avatar: 'Avatar',
    downloadHistory: 'Historial de descargas',
    settings: 'Configuración de la cuenta',
    deleteAccount: 'Eliminar cuenta',
    confirmDelete: 'Confirmar eliminación de cuenta',
    deleteWarning: 'Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.',
    // Nuevas adiciones para la página de perfil
    pageTitle: 'Perfil',
    pageDescription: 'Gestiona la información de tu cuenta y configuraciones',
    basicInfo: {
      title: 'Información Básica',
      description: 'Actualiza la información básica de tu cuenta',
      nameLabel: 'Nombre',
      namePlaceholder: 'Ingresa tu nombre',
      emailLabel: 'Correo electrónico',
      emailNote: 'La dirección de correo electrónico no se puede modificar',
      saveButton: 'Guardar',
      savingButton: 'Guardando...',
      cancelButton: 'Cancelar',
      editButton: 'Editar Perfil',
      updateSuccess: 'Perfil actualizado exitosamente',
      updateError: 'Error en la actualización, por favor intenta de nuevo'
    },
    accountInfo: {
      title: 'Información de la Cuenta',
      description: 'Ver los detalles de tu cuenta',
      email: 'Correo electrónico',
      userId: 'ID de Usuario',
      registrationDate: 'Fecha de Registro'
    },
    dangerZone: {
      title: 'Zona de Peligro',
      description: 'Estas acciones son irreversibles, úsalas con precaución',
      deleteAccount: {
        title: 'Eliminar Cuenta',
        warning: 'Eliminar tu cuenta eliminará permanentemente todos los datos. Esta acción no se puede recuperar.',
        button: 'Eliminar Cuenta'
      }
    }
  },

  // SEO and meta
  seo: {
    siteName: 'InstagramDown - Software de descarga de Instagram',
    defaultTitle: 'Software de descarga de Instagram - Descargador gratuito de fotos y videos de Instagram',
    defaultDescription: 'Software gratuito de descarga de Instagram. Descarga fotos, videos, Stories, IGTV y Reels de Instagram en alta calidad sin marcas de agua. Simple y fácil de usar.',
    keywords: 'software de descarga de Instagram, descarga de fotos de Instagram, descarga de videos de Instagram, descarga de Stories, descarga de IGTV, descarga de Reels',
  },

  // Error messages
  errors: {
    invalidUrl: 'Por favor ingresa una URL válida de Instagram',
    networkError: 'Falló la conexión de red, por favor inténtalo de nuevo',
    serverError: 'Error del servidor, por favor inténtalo más tarde',
    notFound: 'Contenido no encontrado',
    rateLimited: 'Demasiadas solicitudes, por favor inténtalo más tarde',
    unauthorized: 'Necesitas iniciar sesión para realizar esta acción',
    forbidden: 'No tienes permiso para realizar esta acción',
    generic: 'Ocurrió un error desconocido, por favor inténtalo de nuevo',
  },

  // Success messages
  success: {
    downloadStarted: 'Descarga iniciada',
    profileUpdated: 'Perfil actualizado exitosamente',
    settingsSaved: 'Configuración guardada exitosamente',
    accountCreated: 'Cuenta creada exitosamente',
    loginSuccess: 'Inicio de sesión exitoso',
  },

  // Terms of Service page
  terms: {
    title: 'Términos del servicio',
    subtitle: 'Por favor lee estos Términos del servicio cuidadosamente. Al usar nuestro servicio, aceptas estar sujeto a estos términos.',
    lastUpdated: 'Última actualización',
    version: 'Versión',
    tableOfContents: 'Tabla de contenidos',
    sections: {
      serviceDescription: {
        title: '1. Descripción del servicio',
        content: [
          'InstagramDown (referido como "nosotros", "nuestro" o "el servicio") es una herramienta basada en web que permite a los usuarios descargar contenido disponible públicamente de Instagram, incluyendo fotos, videos, Stories, Reels y contenido de IGTV.',
          'Este servicio está destinado únicamente para uso personal y no comercial. Los usuarios aceptan no usar el contenido descargado para ningún propósito ilegal o infractor.',
          'Nos reservamos el derecho de modificar, suspender o terminar el servicio en cualquier momento sin previo aviso.'
        ]
      },
      userResponsibilities: {
        title: '2. Responsabilidades del usuario',
        content: [
          'Los usuarios deben cumplir con todas las leyes y regulaciones aplicables, incluyendo pero no limitándose a la ley de derechos de autor, ley de privacidad y ley de protección de datos.',
          'Los usuarios solo pueden descargar contenido del cual poseen los derechos de autor o han obtenido la autorización apropiada.',
          'Los usuarios están prohibidos de usar este servicio para los siguientes propósitos:',
          '• Infringir derechos de autor, marcas registradas u otros derechos de propiedad intelectual de otros',
          '• Acosar, amenazar o violar la privacidad de otros',
          '• Distribuir malware, virus u otro código dañino',
          '• Participar en cualquier forma de actividad comercial o promoción de marketing',
          '• Violar los Términos de uso y Pautas de la comunidad de Instagram',
          'Los usuarios son completamente responsables de su uso de este servicio.'
        ]
      },
      intellectualProperty: {
        title: '3. Propiedad intelectual',
        content: [
          'Todo el contenido, funcionalidad y tecnología de este servicio están protegidos por derechos de autor, marcas registradas y otras leyes de propiedad intelectual.',
          'Los derechos de autor del contenido descargado a través de este servicio pertenecen a los creadores originales del contenido.',
          'Los usuarios no pueden copiar, modificar, distribuir o comercializar ninguna parte de este servicio sin nuestro permiso escrito explícito.',
          'Instagram es una marca registrada de Meta Platforms, Inc. No estamos afiliados con Instagram o Meta de ninguna manera.'
        ]
      },
      disclaimer: {
        title: '4. Exención de responsabilidad',
        content: [
          'Este servicio se proporciona "tal como está" sin ninguna garantía expresa o implícita.',
          'No garantizamos la continuidad, precisión, integridad o puntualidad del servicio.',
          'No somos responsables de ninguno de los siguientes:',
          '• Cualquier pérdida directa o indirecta causada por el uso de este servicio',
          '• Interrupciones del servicio, pérdida de datos o fallas del sistema',
          '• La precisión o legalidad del contenido de terceros',
          '• Consecuencias que surjan de que los usuarios violen las leyes y regulaciones',
          'Los usuarios usan este servicio bajo su propio riesgo.'
        ]
      },
      serviceChanges: {
        title: '5. Cambios del servicio',
        content: [
          'Nos reservamos el derecho de modificar, actualizar o terminar el servicio en cualquier momento.',
          'Los cambios importantes se comunicarán a los usuarios a través de anuncios en el sitio web u otros medios apropiados.',
          'El uso continuo del servicio indica la aceptación de dichos cambios.',
          'Si los usuarios no están de acuerdo con los cambios, deben dejar de usar el servicio inmediatamente.'
        ]
      },
      accountTermination: {
        title: '6. Terminación de cuenta',
        content: [
          'Tenemos el derecho de terminar el acceso del usuario en las siguientes situaciones:',
          '• Violación de estos Términos del servicio',
          '• Participación en actividades ilegales o dañinas',
          '• Abuso o uso excesivo de los recursos del servicio',
          '• Otros comportamientos que consideremos inapropiados',
          'Después de la terminación de la cuenta, los usuarios deben dejar de usar el servicio inmediatamente.',
          'No somos responsables de ninguna pérdida causada por la terminación de la cuenta.'
        ]
      },
      disputeResolution: {
        title: '7. Resolución de disputas',
        content: [
          'Cualquier disputa que surja de estos términos debe resolverse primero a través de negociación amistosa.',
          'Si la negociación falla, las disputas deben someterse a un tribunal con jurisdicción donde se encuentra el proveedor del servicio.',
          'La interpretación y cumplimiento de estos términos se rige por las leyes de España.',
          'Si alguna disposición de estos términos se considera inválida, no afecta la validez de otras disposiciones.'
        ]
      },
      contact: {
        title: '8. Contáctanos',
        content: [
          'Si tienes alguna pregunta sobre estos Términos del servicio, por favor contáctanos a través de:',
          '• Correo electrónico: support@instagramdown.com',
          '• Soporte en línea: Visita nuestro sitio web para más ayuda',
          'Responderemos a tus consultas lo antes posible después de recibirlas.'
        ]
      }
    },
    effectiveDate: 'Fecha de vigencia: 1 de enero de 2024',
    acknowledgment: 'Al usar este servicio, reconoces que has leído, entendido y aceptas estar sujeto a estos Términos del servicio.'
  },

  // Download Center page
  downloadCenter: {
    title: 'Centro de Descargas de Instagram',
    subtitle: 'Elige tu tipo de descarga preferido y disfruta del servicio profesional de descarga de contenido de Instagram',
    breadcrumb: {
      home: 'Inicio',
      center: 'Centro de Descargas'
    },
    badges: {
      freeUse: 'Uso Gratuito',
      hdNoWatermark: 'HD Sin Marca de Agua'
    },
    options: {
      post: {
        title: 'Publicaciones de Instagram',
        description: 'Descarga fotos y videos de Instagram con calidad HD y sin marca de agua',
        features: ['Calidad HD', 'Sin Marca de Agua', 'Descarga en Lote']
      },
      stories: {
        title: 'Instagram Stories',
        description: 'Descarga anónima de Stories, sin registros de visualización, contenido de 24 horas',
        features: ['Descarga Anónima', 'Sin Registros', 'Obtención en Tiempo Real']
      },
      reels: {
        title: 'Instagram Reels',
        description: 'Descarga videos cortos de Instagram Reels manteniendo la calidad original',
        features: ['Videos Cortos', 'Calidad Original', 'Descarga Rápida']
      },
      igtv: {
        title: 'Videos IGTV',
        description: 'Descarga contenido de video largo de IGTV en formato HD',
        features: ['Videos Largos', 'Formato HD', 'Descarga Estable']
      },
      highlights: {
        title: 'Highlights',
        description: 'Descarga contenido destacado del usuario para almacenamiento permanente',
        features: ['Contenido Seleccionado', 'Almacenamiento Permanente', 'Procesamiento en Lote']
      },
      profile: {
        title: 'Perfil de Usuario',
        description: 'Descarga avatares de usuario, fotos de perfil y otro contenido',
        features: ['Descarga de Avatar', 'Fotos de Perfil', 'Rápido y Sencillo']
      }
    },
    howToUse: {
      title: '¿Cómo usar el Descargador de Instagram?',
      steps: {
        step1: {
          title: 'Seleccionar Tipo de Descarga',
          description: 'Elige diferentes tipos de descarga como Publicaciones, Stories, Reels etc. según tus necesidades'
        },
        step2: {
          title: 'Pegar Enlace',
          description: 'Copia el enlace del contenido de Instagram y pégalo en la página de descarga correspondiente'
        },
        step3: {
          title: 'Iniciar Descarga',
          description: 'Haz clic en el botón de descarga, espera a que termine el procesamiento y guarda el archivo en tu dispositivo'
        }
      }
    },
    button: {
      useNow: 'Usar Ahora'
    }
  },

  // About page
  about: {
    title: 'Acerca del Descargador de Instagram',
    features: {
      title: 'Características',
      items: [
        'Soporte para descargar fotos y videos de Instagram',
        'Descargas de archivos multimedia de alta calidad',
        'Soporte para descargas en lote',
        'Interfaz simple y fácil de usar',
        'No necesitas iniciar sesión en la cuenta de Instagram',
        'Proceso de descarga rápido y seguro'
      ]
    },
    contentTypes: {
      title: 'Tipos de Contenido Soportados',
      items: [
        'Publicaciones de imagen única',
        'Publicaciones de video',
        'Carrusel de fotos/videos',
        'Instagram Stories',
        'Highlights',
        'Fotos de perfil'
      ]
    },
    instructions: {
      title: 'Instrucciones',
      steps: {
        step1: {
          title: 'Copiar Enlace',
          description: 'Encuentra el contenido que quieres descargar en Instagram, haz clic en compartir, copia el enlace'
        },
        step2: {
          title: 'Pegar Enlace',
          description: 'Pega el enlace copiado en el cuadro de entrada de la página de descarga'
        },
        step3: {
          title: 'Iniciar Descarga',
          description: 'Haz clic en el botón de descarga y espera a que termine el procesamiento'
        },
        step4: {
          title: 'Guardar Archivo',
          description: 'Después de completar el procesamiento, el archivo comenzará a descargarse automáticamente a tu dispositivo'
        }
      }
    }
  },

  // Footer
  footer: {
    company: 'Descargador de Instagram',
    copyright: 'Derechos de autor',
    allRightsReserved: 'Todos los derechos reservados',
    links: {
      privacy: 'Política de privacidad',
      terms: 'Términos del servicio',
      help: 'Centro de ayuda',
      contact: 'Contáctanos',
      about: 'Acerca de nosotros',
    },
    social: {
      title: 'Síguenos',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
    },
    sections: {
      product: 'Producto',
      support: 'Soporte',
      company: 'Empresa',
      legal: 'Legal',
    },
    description: 'La mejor herramienta de descarga de contenido de Instagram, compatible con descargas de fotos, videos, Stories, IGTV y Reels.',
  },

  // Privacy Policy
  privacy: {
    title: 'Política de privacidad',
    subtitle: 'Aprende cómo recopilamos, usamos y protegemos tu información personal',
    lastUpdated: 'Última actualización',
    tableOfContents: 'Tabla de contenidos',
    sections: {
      overview: {
        title: 'Resumen',
        content: 'Esta Política de privacidad explica cómo InstagramDown ("nosotros", "nuestro") recopila, usa y protege tu información personal cuando usas nuestro servicio de descarga de contenido de Instagram. Estamos comprometidos a proteger tus derechos de privacidad y asegurar el cumplimiento con las leyes y regulaciones de protección de datos relevantes, incluyendo GDPR (Reglamento General de Protección de Datos) y CCPA (Ley de Privacidad del Consumidor de California).'
      },
      dataCollection: {
        title: 'Recopilación de datos',
        content: 'Recopilamos los siguientes tipos de información:',
        items: [
          'Enlaces y URLs de Instagram que proporcionas',
          'Información del tipo de navegador, versión y sistema operativo',
          'Dirección IP y ubicación geográfica (solo para fines de análisis)',
          'Datos de uso recopilados a través de cookies y tecnologías similares',
          'Identificadores de dispositivo e información de red',
          'Estadísticas de uso y datos de rendimiento'
        ]
      },
      dataUsage: {
        title: 'Uso de datos',
        content: 'Usamos la información recopilada para:',
        items: [
          'Proporcionar y mejorar nuestro servicio de descarga de contenido de Instagram',
          'Procesar y ejecutar tus solicitudes de descarga',
          'Analizar el uso del servicio y optimizar la experiencia del usuario',
          'Prevenir fraude y asegurar la seguridad del servicio',
          'Cumplir con obligaciones legales y responder a procesos legales',
          'Enviar notificaciones importantes del servicio y actualizaciones'
        ]
      },
      dataSecurity: {
        title: 'Seguridad de datos',
        content: 'Implementamos las siguientes medidas para proteger tus datos:',
        items: [
          'Cifrado SSL/TLS para toda la transmisión de datos sensibles',
          'Mecanismos de control de acceso y autenticación',
          'Auditorías de seguridad regulares y evaluaciones de vulnerabilidad',
          'Principio de minimización de datos: recopilar solo información necesaria',
          'Procedimientos seguros de almacenamiento y respaldo de datos',
          'Capacitación del personal en protección de datos y restricciones de acceso'
        ]
      },
      thirdPartyServices: {
        title: 'Servicios de terceros',
        content: 'Usamos los siguientes servicios de terceros que pueden recopilar tu información:',
        items: [
          'Google Analytics - Análisis de uso del sitio web',
          'Cloudflare - Servicios de CDN y seguridad',
          'API de Instagram - Obtención de contenido (cumple con los Términos del servicio de Instagram)',
          'Stripe - Procesamiento de pagos (si aplica)',
          'Proveedores de almacenamiento en la nube - Almacenamiento temporal de archivos'
        ]
      },
      userRights: {
        title: 'Tus derechos',
        content: 'Bajo GDPR y otras leyes de protección de datos, tienes los siguientes derechos:',
        items: [
          'Derecho de acceso: Obtener copias de tus datos personales que tenemos',
          'Derecho de rectificación: Solicitar la corrección de datos personales inexactos o incompletos',
          'Derecho de eliminación: Solicitar la eliminación de tus datos personales en circunstancias específicas',
          'Derecho a restringir el procesamiento: Limitar nuestro procesamiento de tus datos personales',
          'Derecho a la portabilidad de datos: Recibir tus datos en un formato estructurado y de uso común',
          'Derecho de oposición: Oponerte al procesamiento basado en intereses legítimos'
        ]
      },
      dataRetention: {
        title: 'Retención de datos',
        content: 'Nuestra política de retención de datos es la siguiente:',
        items: [
          'Historial de descargas: Eliminado automáticamente después de 30 días',
          'Direcciones IP y registros: Retenidos por 90 días para análisis de seguridad',
          'Datos de análisis: Anonimizados y retenidos por 2 años',
          'Datos de cookies: Retenidos por períodos variables según el tipo de cookie',
          'Información de contacto: Hasta que solicites la eliminación o cierre de cuenta',
          'Datos requeridos legalmente: Retenidos según lo requieran las leyes aplicables'
        ]
      },
      cookies: {
        title: 'Política de cookies',
        content: 'Usamos los siguientes tipos de cookies:',
        items: [
          'Cookies esenciales: Funcionalidad básica que asegura el funcionamiento adecuado del sitio web',
          'Cookies de análisis: Nos ayudan a entender los patrones de uso del sitio web',
          'Cookies funcionales: Recuerdan tus preferencias y configuraciones',
          'Cookies de marketing: Usadas para publicidad personalizada y recomendaciones de contenido',
          'Puedes gestionar las preferencias de cookies a través de la configuración de tu navegador',
          'Deshabilitar ciertas cookies puede afectar la funcionalidad del sitio web'
        ]
      },
      contact: {
        title: 'Contáctanos',
        content: 'Si tienes alguna pregunta sobre nuestra política de privacidad o necesitas ejercer tus derechos, por favor contáctanos:',
        email: 'privacy@inspopmars.com',
        address: 'Oficial de Protección de Datos\nInstagramDown\n[Dirección de la empresa]',
        response: 'Responderemos a tu solicitud dentro de 30 días'
      }
    }
  },

  // Download subpage translations
  downloadPages: {
    stories: {
      title: 'Descargador de Instagram Stories',
      description: 'Herramienta profesional de descarga de Instagram Stories',
      heading: 'Descargador de Instagram Stories',
      subheading: 'Descarga anónima de fotos y videos de Instagram Stories',
      inputPlaceholder: 'Ingresa nombre de usuario de Instagram o enlace de Stories...',
      features: ['Descarga Anónima', 'Sin Registros de Vista', 'Contenido de 24 Horas'],
      howToUse: '¿Cómo Descargar Instagram Stories?',
      steps: {
        step1: 'Ingresa nombre de usuario o copia enlace de Stories',
        step2: 'Haz clic en el botón de descarga para comenzar el procesamiento',
        step3: 'Selecciona contenido de Stories para descargar',
        step4: 'Espera a que termine el procesamiento y guarda en el dispositivo'
      }
    },
    post: {
      title: 'Descargador de Publicaciones de Instagram',
      description: 'Herramienta de descarga de fotos y videos de publicaciones de Instagram',
      heading: 'Descarga de Fotos/Videos de Instagram',
      subheading: 'Descarga de alta calidad del contenido de publicaciones de Instagram, soporta imágenes individuales, carruseles y videos',
      inputPlaceholder: 'Pega enlace de publicación de Instagram...',
      features: ['Calidad HD', 'Sin Marca de Agua', 'Descarga en Lote', 'Soporte de Carrusel'],
      howToUse: '¿Cómo Descargar Publicaciones de Instagram?'
    },
    reels: {
      title: 'Descargador de Instagram Reels',
      description: 'Herramienta de descarga de videos cortos de Instagram Reels',
      heading: 'Descarga de Instagram Reels',
      subheading: 'Descarga videos cortos de Instagram Reels manteniendo la calidad original',
      inputPlaceholder: 'Pega enlace de Instagram Reels...',
      features: ['Videos Cortos', 'Calidad Original', 'Descarga Rápida', 'Formato MP4'],
      howToUse: '¿Cómo Descargar Instagram Reels?'
    },
    igtv: {
      title: 'Descargador de Videos IGTV',
      description: 'Herramienta de descarga de contenido de video largo de IGTV',
      heading: 'Descarga de Videos IGTV',
      subheading: 'Descarga contenido de video largo de IGTV con soporte de formato HD',
      inputPlaceholder: 'Pega enlace de video IGTV...',
      features: ['Videos Largos', 'Formato HD', 'Descarga Estable', 'Soporte de Archivos Grandes'],
      howToUse: '¿Cómo Descargar Videos IGTV?'
    },
    highlights: {
      title: 'Descargador de Highlights',
      description: 'Herramienta de descarga de contenido seleccionado de Instagram Highlights',
      heading: 'Descarga de Highlights',
      subheading: 'Descarga contenido destacado del usuario para almacenamiento permanente',
      inputPlaceholder: 'Ingresa nombre de usuario de Instagram...',
      features: ['Contenido Seleccionado', 'Almacenamiento Permanente', 'Procesamiento en Lote', 'Descarga por Categoría'],
      howToUse: '¿Cómo Descargar Instagram Highlights?'
    },
    profile: {
      title: 'Descargador de Perfil de Usuario',
      description: 'Herramienta de descarga de avatar de usuario de Instagram y perfil',
      heading: 'Descarga de Avatar de Usuario',
      subheading: 'Descarga avatares de usuario, fotos de perfil y otro contenido',
      inputPlaceholder: 'Ingresa nombre de usuario de Instagram...',
      features: ['Descarga de Avatar', 'Fotos de Perfil', 'Rápido y Sencillo', 'Calidad HD'],
      howToUse: '¿Cómo Descargar Perfiles de Usuario?'
    },
    private: {
      title: 'Descargador de Contenido Privado',
      description: 'Herramienta de descarga de contenido privado de Instagram',
      heading: 'Descarga de Contenido Privado',
      subheading: 'Descargar contenido de cuenta privada (se requiere autorización)',
      inputPlaceholder: 'Se requiere autorización de inicio de sesión para descarga de contenido privado...',
      features: ['Contenido Privado', 'Acceso Autorizado', 'Descarga Segura', 'Privacidad del Usuario'],
      howToUse: '¿Cómo Descargar Contenido Privado?'
    }
  },

  // Páginas de suscripción
  subscription: {
    // Títulos y descripciones de páginas
    pageTitle: 'Gestión de Suscripción',
    pageDescription: 'Gestiona tus planes de suscripción e información de facturación',
    // Sección de suscripción actual
    currentSubscription: 'Suscripción Actual',
    noSubscription: 'Sin Suscripción Activa',
    selectPlan: 'Elige un plan de suscripción que te convenga para comenzar',
    plans: 'Planes de Suscripción',
    currentPlan: 'Plan Actual',
    validUntil: 'Válido Hasta',
    usageThisPeriod: 'Uso en Este Período',
    unlimited: 'Ilimitado',
    times: 'veces',
    paymentMethod: 'Método de Pago',
    stripePayment: 'Pago Stripe',
    alipayPayment: 'Pago Alipay',
    verifyingPayment: 'Verificando estado de pago...',
    paymentSuccess: '¡Pago Exitoso!',
    paymentCanceled: 'Pago Cancelado',
    thankYouSubscription: '¡Gracias por tu suscripción! Tu cuenta ha sido actualizada exitosamente y ahora puedes disfrutar del servicio completo.',
    paymentCanceledMessage: 'Tu pago ha sido cancelado y no se han realizado cargos. Si tienes preguntas, no dudes en contactarnos.',
    viewSubscriptionDetails: 'Ver Detalles de Suscripción',
    startUsing: 'Comenzar a Usar',
    retrySelectPlan: 'Seleccionar Plan de Nuevo',
    returnHome: 'Volver al Inicio',
    status: {
      active: 'Activo',
      canceled: 'Cancelado',
      expired: 'Expirado',
      pending: 'Pendiente'
    },
    errors: {
      fetchFailed: 'Error al obtener información de suscripción',
      plansFetchFailed: 'Error al obtener información de planes',
      checkoutFailed: 'Error al crear sesión de pago',
      unknownError: 'Error desconocido',
      retryLater: 'Error al crear sesión de pago, inténtalo más tarde'
    },
    duration: {
      monthly: 'mes',
      yearly: 'año'
    },
    // Contenido de plan original
    title: 'Planes de Suscripción',
    description: 'Elige el plan de suscripción que te convenga',
    heading: 'Elige tu Plan de Suscripción',
    subheading: 'Desbloquea más funciones avanzadas y disfruta de una mejor experiencia de descarga',
    features: {
      title: '¿Por Qué Elegir un Plan de Pago?',
      items: [
        'Límites de descarga más altos',
        'Mejor garantía de calidad',
        'Soporte técnico prioritario',
        'Actualizaciones continuas de funciones'
      ]
    }
  },

  // Páginas de descarga en lote
  batchDownload: {
    // Información básica de página
    pageTitle: 'Descarga en Lote',
    pageDescription: 'Procesa eficientemente múltiples enlaces de Instagram para descarga en lote',
    placeholder: 'Agregar múltiples enlaces de Instagram para descarga en lote...',
    optimizedFor: 'Descarga en Lote',
    features: ['Procesamiento en Lote', 'Cola de Tareas', 'Seguimiento de Progreso'],
    title: 'Descarga en Lote',
    description: 'Descargar múltiple contenido de Instagram de una vez',
    heading: 'Herramienta de Descarga en Lote',
    subheading: 'Mejora la eficiencia procesando múltiples enlaces de Instagram de una vez',
    inputPlaceholder: 'Ingresa un enlace de Instagram por línea...',
    addLink: 'Agregar Enlace',
    removeLink: 'Eliminar',
    startBatch: 'Comenzar Descarga en Lote',
    progress: 'Progreso',
    completed: 'Completado',
    failed: 'Fallido',
    pending: 'Pendiente',
    howToUse: '¿Cómo Usar la Descarga en Lote?',
    steps: {
      step1: 'Pega múltiples enlaces de Instagram (uno por línea)',
      step2: 'Haz clic en comenzar descarga en lote',
      step3: 'Monitorea el progreso y estado de descarga',
      step4: 'Obtén paquete de archivo cuando termine la descarga'
    },
    limits: {
      free: 'Usuarios gratuitos: Máximo 5 enlaces por lote',
      premium: 'Usuarios premium: Máximo 50 enlaces por lote',
      pro: 'Usuarios pro: Ilimitado'
    }
  }
} as const;