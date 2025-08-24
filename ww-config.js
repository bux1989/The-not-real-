export default {
  editor: {
    label: {
      en: 'Fehlzeiten Dashboard',
      de: 'Fehlzeiten Dashboard'
    },
    icon: 'calendar-check',
    bubble: {
      icon: 'calendar-check',
    },
    infoTag: content => ({
      text: content.dashboardTitle || 'Fehlzeiten Dashboard',
      color: 'var(--ww-color-blue-500)',
    }),
  },
  
  properties: {
    // ===== DATA SOURCE CONFIGURATION =====
    supabaseTable: {
      label: { en: 'Data Source Table/View', de: 'Datenquelle Tabelle/View' },
      type: 'Text',
      defaultValue: 'vw_attendance_dashboard',
      section: 'data',
      options: {
        placeholder: 'e.g. vw_attendance_dashboard'
      }
    },
    
    schoolId: {
      label: { en: 'School ID', de: 'Schul-ID' },
      type: 'Text',
      defaultValue: '',
      section: 'data',
      options: {
        placeholder: 'UUID of the school'
      }
    },
    
    attendanceCollection: {
      label: { en: 'Attendance Collection', de: 'Fehlzeiten Collection' },
      type: 'Query',
      defaultValue: '',
      section: 'data'
    },
    
    classesCollection: {
      label: { en: 'Classes Collection', de: 'Klassen Collection' },
      type: 'Query',
      defaultValue: '',
      section: 'data'
    },
    
    studentsCollection: {
      label: { en: 'Students Collection', de: 'Schüler Collection' },
      type: 'Query',
      defaultValue: '',
      section: 'data'
    },
    
    // ===== HEADER CONFIGURATION =====
    dashboardTitle: {
      label: { en: 'Dashboard Title', de: 'Dashboard Titel' },
      type: 'Text',
      defaultValue: 'Fehlzeiten',
      section: 'header'
    },
    
    showHeader: {
      label: { en: 'Show Header', de: 'Header anzeigen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'header'
    },
    
    // ===== UI DISPLAY CONFIGURATION =====
    showFilters: {
      label: { en: 'Show Filters', de: 'Filter anzeigen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'display'
    },
    
    showExportButton: {
      label: { en: 'Show Export Button', de: 'Export Button anzeigen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'display'
    },
    
    showAddButton: {
      label: { en: 'Show Add Button', de: 'Hinzufügen Button anzeigen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'display'
    },
    
    showResultsCount: {
      label: { en: 'Show Results Count', de: 'Ergebnis-Anzahl anzeigen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'display'
    },
    
    compactMode: {
      label: { en: 'Compact Mode', de: 'Kompakt Modus' },
      type: 'OnOff',
      defaultValue: false,
      section: 'display'
    },
    
    // ===== TABLE CONFIGURATION =====
    sortableColumns: {
      label: { en: 'Enable Column Sorting', de: 'Spalten-Sortierung aktivieren' },
      type: 'OnOff',
      defaultValue: true,
      section: 'table'
    },
    
    clickableRows: {
      label: { en: 'Clickable Rows', de: 'Klickbare Zeilen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'table'
    },
    
    showStatusIcons: {
      label: { en: 'Show Status Icons', de: 'Status Icons anzeigen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'table'
    },
    
    showSourceIndicators: {
      label: { en: 'Show Source Indicators', de: 'Quellen-Indikatoren anzeigen' },
      type: 'OnOff',
      defaultValue: true,
      section: 'table'
    },
    
    itemsPerPage: {
      label: { en: 'Items Per Page', de: 'Einträge pro Seite' },
      type: 'Number',
      defaultValue: 25,
      section: 'table',
      options: {
        min: 5,
        max: 100,
        step: 5
      }
    },
    
    // ===== BEHAVIOR CONFIGURATION =====
    allowEdit: {
      label: { en: 'Allow Edit', de: 'Bearbeitung erlauben' },
      type: 'OnOff',
      defaultValue: true,
      section: 'behavior'
    },
    
    allowDelete: {
      label: { en: 'Allow Delete', de: 'Löschen erlauben' },
      type: 'OnOff',
      defaultValue: false,
      section: 'behavior'
    },
    
    allowAdd: {
      label: { en: 'Allow Add New', de: 'Hinzufügen erlauben' },
      type: 'OnOff',
      defaultValue: true,
      section: 'behavior'
    },
    
    allowExport: {
      label: { en: 'Allow Export', de: 'Export erlauben' },
      type: 'OnOff',
      defaultValue: true,
      section: 'behavior'
    },
    
    autoRefresh: {
      label: { en: 'Auto Refresh (seconds)', de: 'Auto-Aktualisierung (Sekunden)' },
      type: 'Number',
      defaultValue: 0,
      section: 'behavior',
      options: {
        min: 0,
        max: 300,
        step: 30
      }
    },
    
    // ===== FILTER DEFAULTS =====
    defaultClass: {
      label: { en: 'Default Class Filter', de: 'Standard Klassenfilter' },
      type: 'Text',
      defaultValue: '',
      section: 'filters',
      options: {
        placeholder: 'e.g. 5a, 6b (empty = all)'
      }
    },
    
    defaultDate: {
      label: { en: 'Default Date Filter', de: 'Standard Datumsfilter' },
      type: 'Text',
      defaultValue: '',
      section: 'filters',
      options: {
        placeholder: 'YYYY-MM-DD (empty = today)'
      }
    },
    
    defaultStatus: {
      label: { en: 'Default Status Filter', de: 'Standard Statusfilter' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'alle', label: { en: 'All', de: 'Alle' } },
          { value: 'krankgemeldet', label: { en: 'Sick', de: 'Krankgemeldet' } },
          { value: 'unentschuldigt', label: { en: 'Unexcused', de: 'Unentschuldigt' } },
          { value: 'beurlaubt', label: { en: 'Excused', de: 'Beurlaubt' } },
          { value: 'verspätet', label: { en: 'Late', de: 'Verspätet' } },
          { value: 'ungeklärt', label: { en: 'Unclear', de: 'Ungeklärt' } }
        ]
      },
      defaultValue: 'alle',
      section: 'filters'
    },
    
    defaultSortBy: {
      label: { en: 'Default Sort Column', de: 'Standard Sortierung' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'firstName', label: { en: 'First Name', de: 'Vorname' } },
          { value: 'lastName', label: { en: 'Last Name', de: 'Nachname' } },
          { value: 'class', label: { en: 'Class', de: 'Klasse' } },
          { value: 'time', label: { en: 'Time', de: 'Zeit' } },
          { value: 'status', label: { en: 'Status', de: 'Status' } },
          { value: 'date', label: { en: 'Date', de: 'Datum' } }
        ]
      },
      defaultValue: 'time',
      section: 'filters'
    },
    
    defaultSortOrder: {
      label: { en: 'Default Sort Order', de: 'Standard Sortierreihenfolge' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'asc', label: { en: 'Ascending', de: 'Aufsteigend' } },
          { value: 'desc', label: { en: 'Descending', de: 'Absteigend' } }
        ]
      },
      defaultValue: 'asc',
      section: 'filters'
    },
    
    // ===== STYLING CONFIGURATION =====
    colorTheme: {
      label: { en: 'Color Theme', de: 'Farbschema' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'default', label: { en: 'Default', de: 'Standard' } },
          { value: 'blue', label: { en: 'Blue', de: 'Blau' } },
          { value: 'green', label: { en: 'Green', de: 'Grün' } },
          { value: 'purple', label: { en: 'Purple', de: 'Lila' } },
          { value: 'orange', label: { en: 'Orange', de: 'Orange' } }
        ]
      },
      defaultValue: 'default',
      section: 'style'
    },
    
    tableHeight: {
      label: { en: 'Table Height', de: 'Tabellen-Höhe' },
      type: 'Length',
      defaultValue: '600px',
      section: 'style'
    },
    
    borderRadius: {
      label: { en: 'Border Radius', de: 'Rahmen-Radius' },
      type: 'Length',
      defaultValue: '8px',
      section: 'style'
    },
    
    // ===== STATUS COLORS CONFIGURATION =====
    statusColorSick: {
      label: { en: 'Sick Status Color', de: 'Krankgemeldet Farbe' },
      type: 'Color',
      defaultValue: '#22c55e',
      section: 'statusColors'
    },
    
    statusColorUnexcused: {
      label: { en: 'Unexcused Status Color', de: 'Unentschuldigt Farbe' },
      type: 'Color',
      defaultValue: '#ef4444',
      section: 'statusColors'
    },
    
    statusColorExcused: {
      label: { en: 'Excused Status Color', de: 'Beurlaubt Farbe' },
      type: 'Color',
      defaultValue: '#3b82f6',
      section: 'statusColors'
    },
    
    statusColorLate: {
      label: { en: 'Late Status Color', de: 'Verspätet Farbe' },
      type: 'Color',
      defaultValue: '#f59e0b',
      section: 'statusColors'
    },
    
    statusColorUnclear: {
      label: { en: 'Unclear Status Color', de: 'Ungeklärt Farbe' },
      type: 'Color',
      defaultValue: '#6b7280',
      section: 'statusColors'
    },
    
    // ===== EXPORT CONFIGURATION =====
    exportFormats: {
      label: { en: 'Available Export Formats', de: 'Verfügbare Export-Formate' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'csv,xlsx,pdf', label: { en: 'All Formats', de: 'Alle Formate' } },
          { value: 'csv,xlsx', label: { en: 'CSV & Excel', de: 'CSV & Excel' } },
          { value: 'csv', label: { en: 'CSV Only', de: 'Nur CSV' } },
          { value: 'xlsx', label: { en: 'Excel Only', de: 'Nur Excel' } },
          { value: 'pdf', label: { en: 'PDF Only', de: 'Nur PDF' } }
        ]
      },
      defaultValue: 'csv,xlsx,pdf',
      section: 'export'
    },
    
    exportFilename: {
      label: { en: 'Export Filename Prefix', de: 'Export Dateiname-Präfix' },
      type: 'Text',
      defaultValue: 'fehlzeiten',
      section: 'export',
      options: {
        placeholder: 'e.g. fehlzeiten, attendance'
      }
    },
    
    // ===== LANGUAGE CONFIGURATION =====
    language: {
      label: { en: 'Language', de: 'Sprache' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'de', label: { en: 'German', de: 'Deutsch' } },
          { value: 'en', label: { en: 'English', de: 'Englisch' } }
        ]
      },
      defaultValue: 'de',
      section: 'language'
    },
    
    // ===== RESPONSIVE CONFIGURATION =====
    hideFiltersOnMobile: {
      label: { en: 'Hide Filters on Mobile', de: 'Filter auf Mobil ausblenden' },
      type: 'OnOff',
      defaultValue: false,
      section: 'responsive'
    },
    
    mobileColumnsToShow: {
      label: { en: 'Mobile Columns Limit', de: 'Mobil Spalten-Limit' },
      type: 'Number',
      defaultValue: 3,
      section: 'responsive',
      options: {
        min: 2,
        max: 5,
        step: 1
      }
    },
    
    // ===== MODAL CONFIGURATION =====
    detailModalTitle: {
      label: { en: 'Detail Modal Title', de: 'Detail Modal Titel' },
      type: 'Text',
      defaultValue: 'Fehlzeit Details',
      section: 'modal'
    },
    
    showDetailModal: {
      label: { en: 'Show Detail Modal on Row Click', de: 'Detail Modal beim Zeilen-Klick' },
      type: 'OnOff',
      defaultValue: true,
      section: 'modal'
    },
    
    // ===== ADVANCED CONFIGURATION =====
    enableRealtime: {
      label: { en: 'Enable Realtime Updates', de: 'Echtzeit-Updates aktivieren' },
      type: 'OnOff',
      defaultValue: true,
      section: 'advanced'
    },
    
    debugMode: {
      label: { en: 'Debug Mode', de: 'Debug Modus' },
      type: 'OnOff',
      defaultValue: false,
      section: 'advanced'
    },
    
    customCSSClasses: {
      label: { en: 'Custom CSS Classes', de: 'Benutzerdefinierte CSS-Klassen' },
      type: 'Text',
      defaultValue: '',
      section: 'advanced',
      options: {
        placeholder: 'space-separated class names'
      }
    }
  },
  
  options: {
    autoByContent: true,
    sizable: true,
    hyperlink: false,
    // WeWeb-specific options
    useClassicEditor: false,
    responsive: true
  }
};
