<template>
  <div 
    class="fehlzeiten-dashboard" 
    :class="[
      `theme-${content.colorTheme || 'default'}`,
      { 'compact-mode': content.compactMode },
      content.customCSSClasses
    ]"
    :style="dashboardStyles"
  >
    <!-- Header -->
    <div v-if="content.showHeader !== false" class="dashboard-header">
      <h1 class="dashboard-title">{{ content.dashboardTitle || 'Fehlzeiten' }}</h1>
      <div class="header-actions">
        <!-- Export Button -->
        <div v-if="content.showExportButton && content.allowExport" class="export-dropdown">
          <button 
            class="export-btn"
            @click="toggleExportMenu"
            :disabled="!hasData"
          >
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          
          <div v-if="showExportMenu" class="export-menu">
            <button 
              v-for="format in availableExportFormats" 
              :key="format"
              @click="handleExport(format)"
              class="export-option"
            >
              {{ getExportLabel(format) }}
            </button>
          </div>
        </div>
        
        <!-- Add Button -->
        <button 
          v-if="content.showAddButton && content.allowAdd"
          class="add-btn primary-btn"
          @click="handleAddEntry"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Fehlzeit eintragen
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div 
      v-if="content.showFilters && !isHiddenOnMobile" 
      class="filters-card"
    >
      <div class="filters-grid">
        <!-- Class Filter -->
        <div class="filter-group">
          <label>Klasse</label>
          <div class="filter-select-wrapper">
            <select 
              v-model="filters.class" 
              class="filter-select"
              @change="onFiltersChange"
            >
              <option value="">Alle</option>
              <option 
                v-for="classItem in availableClasses" 
                :key="classItem.class_id"
                :value="classItem.class_name"
              >
                {{ classItem.class_name }}
              </option>
            </select>
            <button 
              v-if="filters.class"
              class="clear-filter"
              @click="clearFilter('class')"
            >
              ×
            </button>
          </div>
        </div>
        
        <!-- Student Search -->
        <div class="filter-group">
          <label>Schüler*in</label>
          <input
            v-model="filters.student"
            type="text"
            placeholder="Schüler*in suchen..."
            class="filter-input"
            @input="onFiltersChange"
          />
        </div>
        
        <!-- Date Filter -->
        <div class="filter-group">
          <label>Datum</label>
          <div class="date-input-wrapper">
            <input
              v-model="filters.date"
              type="date"
              class="filter-input"
              @change="onFiltersChange"
            />
            <div class="date-controls">
              <button class="date-btn" @click="adjustDate(1)">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              </button>
              <button class="date-btn" @click="adjustDate(-1)">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Status Filter -->
        <div class="filter-group">
          <label>Status</label>
          <select 
            v-model="filters.status" 
            class="filter-select"
            @change="onFiltersChange"
          >
            <option value="alle">Alle</option>
            <option value="krankgemeldet">Krankgemeldet</option>
            <option value="unentschuldigt">Unentschuldigt</option>
            <option value="beurlaubt">Beurlaubt</option>
            <option value="ungeklärt">Ungeklärt</option>
            <option value="verspätet">Verspätet</option>
          </select>
        </div>
        
        <!-- Reset Button -->
        <button class="reset-btn" @click="resetFilters">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          Zurücksetzen
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div v-if="content.showResultsCount" class="results-summary">
      {{ filteredData.length }} Einträge gefunden
      <span v-if="filteredData.length !== allData.length">
        ({{ allData.length }} gesamt)
      </span>
    </div>

    <!-- Table -->
    <div class="table-container" :style="{ height: content.tableHeight }">
      <table v-if="hasData" class="fehlzeiten-table">
        <thead>
          <tr>
            <th 
              v-if="content.sortableColumns" 
              @click="handleSort('firstName')"
              class="sortable-header"
            >
              <div class="header-content">
                <span>Vorname</span>
                <svg class="sort-icon" :class="getSortIconClass('firstName')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 8l4-4 4 4"/>
                  <path d="M7 4v16"/>
                  <path d="M21 16l-4 4-4-4"/>
                  <path d="M17 20V4"/>
                </svg>
              </div>
            </th>
            <th v-else>Vorname</th>
            
            <th 
              v-if="content.sortableColumns" 
              @click="handleSort('lastName')"
              class="sortable-header"
            >
              <div class="header-content">
                <span>Nachname</span>
                <svg class="sort-icon" :class="getSortIconClass('lastName')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 8l4-4 4 4"/>
                  <path d="M7 4v16"/>
                  <path d="M21 16l-4 4-4-4"/>
                  <path d="M17 20V4"/>
                </svg>
              </div>
            </th>
            <th v-else>Nachname</th>
            
            <th 
              v-if="content.sortableColumns" 
              @click="handleSort('class')"
              class="sortable-header"
            >
              <div class="header-content">
                <span>Klasse</span>
                <svg class="sort-icon" :class="getSortIconClass('class')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 8l4-4 4 4"/>
                  <path d="M7 4v16"/>
                  <path d="M21 16l-4 4-4-4"/>
                  <path d="M17 20V4"/>
                </svg>
              </div>
            </th>
            <th v-else>Klasse</th>
            
            <th 
              v-if="content.sortableColumns" 
              @click="handleSort('time')"
              class="sortable-header"
            >
              <div class="header-content">
                <span>Zeit</span>
                <svg class="sort-icon" :class="getSortIconClass('time')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 8l4-4 4 4"/>
                  <path d="M7 4v16"/>
                  <path d="M21 16l-4 4-4-4"/>
                  <path d="M17 20V4"/>
                </svg>
              </div>
            </th>
            <th v-else>Zeit</th>
            
            <th 
              v-if="content.sortableColumns" 
              @click="handleSort('status')"
              class="sortable-header"
            >
              <div class="header-content">
                <span>Status</span>
                <svg class="sort-icon" :class="getSortIconClass('status')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 8l4-4 4 4"/>
                  <path d="M7 4v16"/>
                  <path d="M21 16l-4 4-4-4"/>
                  <path d="M17 20V4"/>
                </svg>
              </div>
            </th>
            <th v-else>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in paginatedData"
            :key="entry.id"
            class="table-row"
            :class="{ 'clickable': content.clickableRows }"
            @click="content.clickableRows ? handleRowClick(entry) : null"
          >
            <td>
              <div class="student-name-cell">
                <span>{{ entry.first_name }}</span>
                <svg
                  v-if="content.showSourceIndicators && entry.source_type === 'eltern-app'"
                  class="source-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  :title="getSourceTitle(entry.source_type)"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
            </td>
            <td>{{ entry.last_name }}</td>
            <td>{{ entry.student_class }}</td>
            <td>
              <span v-if="entry.date_range" class="time-range">{{ entry.date_range }}</span>
              <span v-else class="full-day">ganztägig</span>
            </td>
            <td>
              <div class="status-cell">
                <span 
                  class="status-badge"
                  :class="getStatusClass(entry.status)"
                  :style="{ backgroundColor: getStatusColor(entry.status) }"
                >
                  <svg v-if="content.showStatusIcons" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <component :is="getStatusIconPath(entry.status)" />
                  </svg>
                  {{ getStatusText(entry.status) }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h3>Keine Einträge gefunden</h3>
        <p>Keine Einträge für den gewählten Zeitraum gefunden.</p>
        <div class="empty-actions">
          <button class="outline-btn" @click="resetFilters">Filter zurücksetzen</button>
          <button 
            v-if="content.allowAdd"
            class="primary-btn" 
            @click="handleAddEntry"
          >
            Fehlzeit eintragen
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="hasData && totalPages > 1" class="pagination">
      <button 
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ‹ Zurück
      </button>
      
      <span class="page-info">
        Seite {{ currentPage }} von {{ totalPages }}
      </span>
      
      <button 
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Weiter ›
      </button>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ content.detailModalTitle || 'Fehlzeit Details' }}</h2>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        
        <div v-if="selectedEntry" class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Name:</label>
              <span>{{ selectedEntry.student_name }}</span>
            </div>
            <div class="detail-item">
              <label>Klasse:</label>
              <span>{{ selectedEntry.student_class }}</span>
            </div>
            <div class="detail-item">
              <label>Datum:</label>
              <span>{{ selectedEntry.date }}</span>
            </div>
            <div class="detail-item">
              <label>Zeit:</label>
              <span>{{ selectedEntry.date_range || 'Ganztägig' }}</span>
            </div>
            <div class="detail-item">
              <label>Status:</label>
              <span 
                class="status-badge"
                :style="{ backgroundColor: getStatusColor(selectedEntry.status) }"
              >
                {{ getStatusText(selectedEntry.status) }}
              </span>
            </div>
            <div class="detail-item">
              <label>Grund:</label>
              <span>{{ selectedEntry.reason || 'Kein Grund angegeben' }}</span>
            </div>
            <div class="detail-item">
              <label>Nachweis:</label>
              <span>{{ selectedEntry.has_attachment ? 'Vorhanden' : 'Nicht vorhanden' }}</span>
            </div>
            <div class="detail-item">
              <label>Erstellt von:</label>
              <span>{{ selectedEntry.created_by }}</span>
            </div>
            <div class="detail-item">
              <label>Erstellt am:</label>
              <span>{{ formatDateTime(selectedEntry.created_at) }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            v-if="content.allowEdit" 
            class="primary-btn" 
            @click="handleEditEntry"
          >
            Bearbeiten
          </button>
          <button 
            v-if="content.allowDelete" 
            class="danger-btn" 
            @click="handleDeleteEntry"
          >
            Löschen
          </button>
          <button class="outline-btn" @click="closeDetailModal">Schließen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, parseISO, addDays, subDays } from 'date-fns';

export default {
  name: 'FehlzeitenDashboard',
  
  props: {
    content: {
      type: Object,
      required: true
    },
    /* wwEditor:start */
    wwEditorState: {
      type: Object,
      required: true
    },
    /* wwEditor:end */
  },
  
  emits: ['update:content', 'trigger-event'],
  
  data() {
    return {
      // Filter state
      filters: {
        class: '',
        student: '',
        date: '',
        status: 'alle'
      },
      
      // Sorting state
      sortBy: 'time',
      sortOrder: 'asc',
      
      // UI state
      showExportMenu: false,
      showDetailModal: false,
      selectedEntry: null,
      currentPage: 1,
      
      // Loading state
      isLoading: false,
      error: null,
      
      // Data cache
      lastUpdate: null
    };
  },
  
  computed: {
    dashboardStyles() {
      return {
        '--border-radius': this.content.borderRadius || '8px',
        '--table-height': this.content.tableHeight || '600px'
      };
    },
    
    // Get data from WeWeb collections
    allData() {
      try {
        const data = this.$wwLib?.wwCollection?.getCollectionData(this.content.attendanceCollection);
        return Array.isArray(data) ? data : this.getMockData();
      } catch (error) {
        console.warn('Failed to load attendance data:', error);
        return this.getMockData();
      }
    },
    
    availableClasses() {
      try {
        const classes = this.$wwLib?.wwCollection?.getCollectionData(this.content.classesCollection);
        return Array.isArray(classes) ? classes : this.getDefaultClasses();
      } catch (error) {
        return this.getDefaultClasses();
      }
    },
    
    hasData() {
      return this.allData.length > 0;
    },
    
    filteredData() {
      return this.allData.filter(item => {
        // Class filter
        if (this.filters.class && item.student_class !== this.filters.class) {
          return false;
        }
        
        // Student search
        if (this.filters.student) {
          const searchTerm = this.filters.student.toLowerCase();
          const studentName = `${item.first_name} ${item.last_name}`.toLowerCase();
          if (!studentName.includes(searchTerm)) {
            return false;
          }
        }
        
        // Status filter
        if (this.filters.status !== 'alle' && item.status !== this.filters.status) {
          return false;
        }
        
        // Date filter
        if (this.filters.date && item.date) {
          const filterDate = new Date(this.filters.date);
          const itemDate = this.parseGermanDate(item.date);
          if (itemDate.toDateString() !== filterDate.toDateString()) {
            return false;
          }
        }
        
        return true;
      });
    },
    
    sortedData() {
      return [...this.filteredData].sort((a, b) => {
        let aVal, bVal;
        
        switch (this.sortBy) {
          case 'firstName':
            aVal = a.first_name || '';
            bVal = b.first_name || '';
            break;
          case 'lastName':
            aVal = a.last_name || '';
            bVal = b.last_name || '';
            break;
          case 'class':
            aVal = a.student_class || '';
            bVal = b.student_class || '';
            break;
          case 'time':
            aVal = a.date_range || (a.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
            bVal = b.date_range || (b.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
            break;
          case 'status':
            aVal = a.status || '';
            bVal = b.status || '';
            break;
          case 'date':
            aVal = a.date || '';
            bVal = b.date || '';
            break;
          default:
            aVal = a.date_range || '00:00';
            bVal = b.date_range || '00:00';
        }
        
        if (this.sortOrder === 'asc') {
          return aVal.localeCompare(bVal, 'de');
        } else {
          return bVal.localeCompare(aVal, 'de');
        }
      });
    },
    
    paginatedData() {
      const itemsPerPage = this.content.itemsPerPage || 25;
      const start = (this.currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return this.sortedData.slice(start, end);
    },
    
    totalPages() {
      const itemsPerPage = this.content.itemsPerPage || 25;
      return Math.ceil(this.sortedData.length / itemsPerPage);
    },
    
    isHiddenOnMobile() {
      return this.content.hideFiltersOnMobile && this.isMobile;
    },
    
    isMobile() {
      return window.innerWidth < 768;
    },
    
    availableExportFormats() {
      const formats = this.content.exportFormats || 'csv,xlsx,pdf';
      return formats.split(',').map(f => f.trim());
    }
  },
  
  watch: {
    'content.defaultClass': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal !== this.filters.class) {
          this.filters.class = newVal;
        }
      }
    },
    
    'content.defaultDate': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal !== this.filters.date) {
          this.filters.date = newVal;
        }
      }
    },
    
    'content.defaultStatus': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal !== this.filters.status) {
          this.filters.status = newVal;
        }
      }
    },
    
    'content.defaultSortBy': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal !== this.sortBy) {
          this.sortBy = newVal;
        }
      }
    },
    
    'content.defaultSortOrder': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal !== this.sortOrder) {
          this.sortOrder = newVal;
        }
      }
    }
  },
  
  mounted() {
    this.initializeFilters();
    this.loadData();
    this.setupAutoRefresh();
    this.setupEventListeners();
  },
  
  beforeUnmount() {
    this.cleanupEventListeners();
    this.clearAutoRefresh();
  },
  
  methods: {
    // Data loading
    async loadData() {
      if (!this.content.attendanceCollection) return;
      
      try {
        this.isLoading = true;
        this.error = null;
        
        // Refresh WeWeb collection with current filters
        await this.$wwLib?.wwCollection?.executeQuery(this.content.attendanceCollection, {
          school_id: this.content.schoolId,
          class_filter: this.filters.class || 'alle',
          student_search: this.filters.student || '',
          status_filter: this.filters.status || 'alle',
          date_filter: this.filters.date || this.getCurrentDate()
        });
        
        this.lastUpdate = new Date();
        this.emitEvent('data-loaded', {
          count: this.filteredData.length,
          totalCount: this.allData.length,
          timestamp: this.lastUpdate.toISOString()
        });
        
      } catch (error) {
        console.error('Failed to load data:', error);
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Filter methods
    initializeFilters() {
      this.filters = {
        class: this.content.defaultClass || '',
        student: '',
        date: this.content.defaultDate || this.getCurrentDate(),
        status: this.content.defaultStatus || 'alle'
      };
      
      this.sortBy = this.content.defaultSortBy || 'time';
      this.sortOrder = this.content.defaultSortOrder || 'asc';
    },
    
    onFiltersChange() {
      this.currentPage = 1; // Reset to first page
      this.loadData();
      this.emitEvent('filters-changed', {
        filters: { ...this.filters },
        resultCount: this.filteredData.length
      });
    },
    
    resetFilters() {
      this.initializeFilters();
      this.onFiltersChange();
    },
    
    clearFilter(filterType) {
      this.filters[filterType] = '';
      this.onFiltersChange();
    },
    
    adjustDate(direction) {
      const currentDate = new Date(this.filters.date || this.getCurrentDate());
      const newDate = direction > 0 ? addDays(currentDate, 1) : subDays(currentDate, 1);
      this.filters.date = format(newDate, 'yyyy-MM-dd');
      this.onFiltersChange();
    },
    
    // Sorting methods
    handleSort(field) {
      if (!this.content.sortableColumns) return;
      
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    },
    
    getSortIconClass(field) {
      if (this.sortBy !== field) return 'sort-inactive';
      return this.sortOrder === 'asc' ? 'sort-asc' : 'sort-desc';
    },
    
    // Pagination methods
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    
    // Event handlers
    handleRowClick(entry) {
      if (!this.content.showDetailModal) return;
      
      this.selectedEntry = entry;
      this.showDetailModal = true;
      
      this.emitEvent('row-selected', {
        selectedEntry: entry,
        studentId: entry.student_id,
        absenceId: entry.id
      });
    },
    
    handleAddEntry() {
      this.emitEvent('add-absence', {
        timestamp: new Date().toISOString()
      });
    },
    
    handleEditEntry() {
      if (!this.selectedEntry) return;
      
      this.emitEvent('edit-absence', {
        absenceId: this.selectedEntry.id,
        studentName: this.selectedEntry.student_name,
        studentClass: this.selectedEntry.student_class,
        currentData: this.selectedEntry
      });
      
      this.closeDetailModal();
    },
    
    handleDeleteEntry() {
      if (!this.selectedEntry) return;
      
      if (confirm('Fehlzeit wirklich löschen?')) {
        this.emitEvent('delete-absence', {
          absenceId: this.selectedEntry.id,
          studentName: this.selectedEntry.student_name,
          confirmed: true
        });
        
        this.closeDetailModal();
      }
    },
    
    handleExport(format) {
      this.emitEvent('export-data', {
        format,
        dataCount: this.filteredData.length,
        filters: this.currentFilters,
        data: this.filteredData
      });
      
      this.showExportMenu = false;
    },
    
    // Modal methods
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedEntry = null;
    },
    
    // Export methods
    toggleExportMenu() {
      this.showExportMenu = !this.showExportMenu;
    },
    
    getExportLabel(format) {
      const labels = {
        csv: 'CSV exportieren',
        xlsx: 'XLSX exportieren', 
        pdf: 'PDF exportieren'
      };
      return labels[format] || format.toUpperCase();
    },
    
    // Status methods
    getStatusColor(status) {
      const colors = {
        krankgemeldet: this.content.statusColorSick || '#22c55e',
        unentschuldigt: this.content.statusColorUnexcused || '#ef4444',
        beurlaubt: this.content.statusColorExcused || '#3b82f6',
        verspätet: this.content.statusColorLate || '#f59e0b',
        ungeklärt: this.content.statusColorUnclear || '#6b7280'
      };
      return colors[status] || '#6b7280';
    },
    
    getStatusText(status) {
      const texts = {
        krankgemeldet: 'Krankgemeldet',
        unentschuldigt: 'Unentschuldigt',
        beurlaubt: 'Beurlaubt',
        verspätet: 'Verspätet',
        ungeklärt: 'Ungeklärt'
      };
      return texts[status] || status;
    },
    
    getStatusClass(status) {
      return `status-${status}`;
    },
    
    getStatusIconPath(status) {
      // Return different icon paths based on status
      const icons = {
        krankgemeldet: 'circle',
        unentschuldigt: 'alert-circle',
        beurlaubt: 'shield',
        verspätet: 'clock',
        ungeklärt: 'help-circle'
      };
      return icons[status] || 'help-circle';
    },
    
    getSourceTitle(sourceType) {
      const titles = {
        'eltern-app': 'Aus Eltern-App übernommen',
        'anwesenheit': 'Anwesenheitskontrolle',
        'schuleingabe': 'Schuleingabe'
      };
      return titles[sourceType] || '';
    },
    
    // Utility methods
    getCurrentDate() {
      return format(new Date(), 'yyyy-MM-dd');
    },
    
    parseGermanDate(dateStr) {
      // Parse DD.MM.YYYY format
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
      return new Date(dateStr);
    },
    
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '';
      try {
        const date = parseISO(dateTimeStr);
        return format(date, 'dd.MM.yyyy, HH:mm');
      } catch {
        return dateTimeStr;
      }
    },
    
    // Auto-refresh setup
    setupAutoRefresh() {
      if (this.content.autoRefresh && this.content.autoRefresh > 0) {
        this.refreshInterval = setInterval(() => {
          this.loadData();
        }, this.content.autoRefresh * 1000);
      }
    },
    
    clearAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },
    
    // Event handling
    setupEventListeners() {
      // Close dropdowns when clicking outside
      document.addEventListener('click', this.handleDocumentClick);
      
      // Responsive handling
      window.addEventListener('resize', this.handleResize);
    },
    
    cleanupEventListeners() {
      document.removeEventListener('click', this.handleDocumentClick);
      window.removeEventListener('resize', this.handleResize);
    },
    
    handleDocumentClick(event) {
      if (!this.$el.contains(event.target)) {
        this.showExportMenu = false;
      }
    },
    
    handleResize() {
      // Handle responsive changes
      this.$forceUpdate();
    },
    
    // WeWeb event emission
    emitEvent(eventName, eventData) {
      this.$emit('trigger-event', {
        name: eventName,
        event: {
          type: eventName,
          ...eventData
        }
      });
    },
    
    // Mock data for development/fallback
    getMockData() {
      return [
        {
          id: '1',
          first_name: 'Leon',
          last_name: 'Schmidt',
          student_name: 'Leon Schmidt',
          student_class: '5b',
          date: '18.08.2025',
          date_range: null,
          duration: 'Ganzer Tag',
          status: 'unentschuldigt',
          reason: 'Krankheit',
          has_attachment: true,
          source_type: 'anwesenheit',
          created_by: 'Schmidt, B.',
          created_at: '2025-08-18T07:45:00Z'
        },
        {
          id: '2',
          first_name: 'Anna',
          last_name: 'Lange',
          student_name: 'Anna Lange',
          student_class: '5b',
          date: '18.08.2025',
          date_range: null,
          duration: 'Ganzer Tag',
          status: 'krankgemeldet',
          reason: 'Fieber und Husten - Krankgemeldet bis 21.08.2025',
          has_attachment: true,
          source_type: 'eltern-app',
          created_by: 'Kraft, M.',
          created_at: '2025-08-18T07:20:00Z'
        },
        {
          id: '3',
          first_name: 'Max',
          last_name: 'Müller',
          student_name: 'Max Müller',
          student_class: '7c',
          date: '18.08.2025',
          date_range: '08:00–09:30',
          duration: 'Zeitfenster',
          status: 'verspätet',
          reason: 'Verschlafen',
          has_attachment: false,
          source_type: 'anwesenheit',
          created_by: 'Fischer, D.',
          created_at: '2025-08-18T09:45:00Z'
        },
        {
          id: '4',
          first_name: 'Mara',
          last_name: 'Klein',
          student_name: 'Mara Klein',
          student_class: '5b',
          date: '18.08.2025',
          date_range: '10:15–11:45',
          duration: 'Zeitfenster',
          status: 'krankgemeldet',
          reason: 'Arzttermin – Nachweis angekündigt',
          has_attachment: false,
          source_type: 'eltern-app',
          created_by: 'Müller, A.',
          created_at: '2025-08-18T08:30:00Z'
        },
        {
          id: '5',
          first_name: 'Emma',
          last_name: 'Taylor',
          student_name: 'Emma Taylor',
          student_class: '6a',
          date: '18.08.2025',
          date_range: '13:30–15:00',
          duration: 'Zeitfenster',
          status: 'krankgemeldet',
          reason: 'Familiärer Notfall',
          has_attachment: true,
          source_type: 'schuleingabe',
          created_by: 'Weber, C.',
          created_at: '2025-08-18T13:00:00Z'
        }
      ];
    },
    
    getDefaultClasses() {
      return [
        { class_id: '1', class_name: '5a', student_count: 24 },
        { class_id: '2', class_name: '5b', student_count: 26 },
        { class_id: '3', class_name: '6a', student_count: 23 },
        { class_id: '4', class_name: '6b', student_count: 25 },
        { class_id: '5', class_name: '7a', student_count: 22 },
        { class_id: '6', class_name: '7b', student_count: 24 },
        { class_id: '7', class_name: '7c', student_count: 23 },
        { class_id: '8', class_name: '8a', student_count: 21 }
      ];
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.fehlzeiten-dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
  line-height: 1.5;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 12px;
  position: relative;
}

/* Buttons */
.primary-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background: #2563eb;
}

.primary-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.outline-btn {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius, 8px);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.outline-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.export-btn {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius, 8px);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.export-btn:hover {
  background: #f9fafb;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius, 8px);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #f9fafb;
}

.danger-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.danger-btn:hover {
  background: #dc2626;
}

/* Icons */
.icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.icon-sm {
  width: 12px;
  height: 12px;
  stroke-width: 2;
}

.source-icon {
  width: 14px;
  height: 14px;
  color: #3b82f6;
  margin-left: 8px;
}

.status-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.sort-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sort-icon.sort-active,
.sort-icon.sort-asc,
.sort-icon.sort-desc {
  opacity: 1;
}

.sort-icon.sort-inactive {
  opacity: 0.3;
}

/* Export Menu */
.export-dropdown {
  position: relative;
}

.export-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius, 8px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 160px;
}

.export-option {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.export-option:last-child {
  border-bottom: none;
}

.export-option:hover {
  background: #f9fafb;
}

/* Filters */
.filters-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius, 8px);
  padding: 20px;
  margin-bottom: 20px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius, 8px);
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select-wrapper {
  position: relative;
}

.clear-filter {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-filter:hover {
  color: #374151;
}

.date-input-wrapper {
  display: flex;
  align-items: center;
}

.date-input-wrapper .filter-input {
  border-radius: var(--border-radius, 8px) 0 0 var(--border-radius, 8px);
  border-right: none;
}

.date-controls {
  display: flex;
  flex-direction: column;
  border: 1px solid #d1d5db;
  border-left: none;
  border-radius: 0 var(--border-radius, 8px) var(--border-radius, 8px) 0;
}

.date-btn {
  background: white;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  border-bottom: 1px solid #d1d5db;
}

.date-btn:last-child {
  border-bottom: none;
}

.date-btn:hover {
  background: #f9fafb;
}

/* Results Summary */
.results-summary {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Table */
.table-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  height: var(--table-height, 600px);
  overflow-y: auto;
}

.fehlzeiten-table {
  width: 100%;
  border-collapse: collapse;
}

.fehlzeiten-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 1;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.sortable-header:hover {
  background: #f3f4f6;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-row {
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row.clickable {
  cursor: pointer;
}

.fehlzeiten-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.student-name-cell {
  display: flex;
  align-items: center;
}

.time-range {
  font-family: monospace;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.full-day {
  color: #6b7280;
  font-style: italic;
}

/* Status Badge */
.status-cell {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.pagination-btn {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius, 8px);
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #d1d5db;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
}

.empty-state p {
  margin: 0 0 24px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius, 8px);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.detail-grid {
  display: grid;
  gap: 16px;
}

.detail-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
}

.detail-item label {
  font-weight: 500;
  color: #374151;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* Theme Variations */
.theme-blue {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
}

.theme-green {
  --primary-color: #10b981;
  --primary-hover: #047857;
}

.theme-purple {
  --primary-color: #8b5cf6;
  --primary-hover: #7c3aed;
}

.theme-orange {
  --primary-color: #f59e0b;
  --primary-hover: #d97706;
}

.theme-blue .primary-btn,
.theme-green .primary-btn,
.theme-purple .primary-btn,
.theme-orange .primary-btn {
  background: var(--primary-color);
}

.theme-blue .primary-btn:hover,
.theme-green .primary-btn:hover,
.theme-purple .primary-btn:hover,
.theme-orange .primary-btn:hover {
  background: var(--primary-hover);
}

/* Compact Mode */
.compact-mode .dashboard-header {
  margin-bottom: 16px;
}

.compact-mode .dashboard-title {
  font-size: 24px;
}

.compact-mode .filters-card {
  padding: 16px;
  margin-bottom: 16px;
}

.compact-mode .filters-grid {
  gap: 12px;
}

.compact-mode .fehlzeiten-table th,
.compact-mode .fehlzeiten-table td {
  padding: 8px 12px;
}

.compact-mode .modal-header,
.compact-mode .modal-body,
.compact-mode .modal-footer {
  padding: 16px 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: space-between;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .fehlzeiten-table {
    font-size: 14px;
  }

  .fehlzeiten-table th,
  .fehlzeiten-table td {
    padding: 8px 12px;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .detail-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .empty-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .dashboard-title {
    font-size: 24px;
  }
  
  .fehlzeiten-dashboard {
    padding: 16px;
  }
}
</style>
