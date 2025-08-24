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
// Data Source Configuration
dataSource: {
label: { en: 'Data Source', de: 'Datenquelle' },
type: 'Query',
defaultValue: '',
section: 'data'
},
schoolId: {
label: { en: 'School ID', de: 'Schul-ID' },
type: 'Text',
defaultValue: '',
section: 'data'
},

// Display Configuration
dashboardTitle: {
label: { en: 'Dashboard Title', de: 'Dashboard Titel' },
type: 'Text',
defaultValue: 'Fehlzeiten',
section: 'display'
},
displayOptions: {
label: { en: 'Display Options', de: 'Anzeigeoptionen' },
type: 'Object',
options: {
object: {
showHeader: { type: 'OnOff', defaultValue: true },
showFilters: { type: 'OnOff', defaultValue: true },
showExportButton: { type: 'OnOff', defaultValue: true },
showResultsCount: { type: 'OnOff', defaultValue: true }
}
},
section: 'display'
},

// Table Configuration
tableSettings: {
label: { en: 'Table Settings', de: 'Tabelleneinstellungen' },
type: 'Object',
options: {
object: {
itemsPerPage: { type: 'Number', defaultValue: 25, min: 5, max: 100 },
sortBy: { 
type: 'TextSelect', 
defaultValue: 'time',
options: [
{ value: 'firstName', label: 'First Name' },
{ value: 'lastName', label: 'Last Name' },
{ value: 'class', label: 'Class' },
{ value: 'time', label: 'Time' },
{ value: 'status', label: 'Status' }
]
}
}
},
section: 'table'
},

// Behavior Configuration
behaviors: {
label: { en: 'Behaviors', de: 'Verhalten' },
type: 'Object',
options: {
object: {
allowEdit: { type: 'OnOff', defaultValue: true },
allowDelete: { type: 'OnOff', defaultValue: false },
allowExport: { type: 'OnOff', defaultValue: true }
}
},
section: 'behavior'
},

// Styling
styling: {
label: { en: 'Styling', de: 'Styling' },
type: 'Object',
options: {
object: {
theme: { 
type: 'TextSelect', 
defaultValue: 'default',
options: [
{ value: 'default', label: 'Default' },
{ value: 'blue', label: 'Blue' },
{ value: 'green', label: 'Green' }
]
},
tableHeight: { type: 'Length', defaultValue: '600px' }
}
},
section: 'style'
}
},
options: {
autoByContent: true,
sizable: true,
hyperlink: false
}
};
