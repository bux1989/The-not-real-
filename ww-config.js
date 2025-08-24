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
infoTag: function(content) {
return {
text: content.dashboardTitle || 'Fehlzeiten Dashboard',
color: 'var(--ww-color-blue-500)'
};
}
},
properties: {
// Data Binding Configuration
attendanceData: {
label: { en: 'Attendance Data', de: 'Fehlzeiten Daten' },
type: 'Array',
defaultValue: [],
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
defaultValue: 'Fehlzeiten'
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
}
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
}
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
}
}
}
},
options: {
autoByContent: true,
sizable: true,
hyperlink: false
}
};
