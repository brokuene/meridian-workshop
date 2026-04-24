<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-row">
      <div class="budget-input-group">
        <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
        <div class="budget-field">
          <span class="currency-prefix">$</span>
          <input
            v-model="budgetInput"
            type="number"
            min="0"
            :placeholder="t('restocking.budgetPlaceholder')"
            class="budget-input"
            @keyup.enter="loadData"
          />
        </div>
        <button @click="loadData" class="btn-primary">
          {{ t('restocking.getRecommendations') }}
        </button>
      </div>

      <div v-if="recommendations.length" class="budget-summary">
        <div class="summary-chip total">
          <span class="chip-label">{{ t('restocking.totalCost') }}</span>
          <span class="chip-value">{{ formatCurrency(totalCost) }}</span>
        </div>
        <div v-if="budgetInput" class="summary-chip" :class="budgetRemaining >= 0 ? 'remaining' : 'over'">
          <span class="chip-label">{{ t('restocking.budgetRemaining') }}</span>
          <span class="chip-value">{{ formatCurrency(budgetRemaining) }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="loadData" class="retry-btn">Retry</button>
    </div>
    <div v-else-if="!recommendations.length" class="empty-state">
      {{ t('restocking.noRecommendations') }}
    </div>
    <div v-else class="card">
      <div class="table-container">
        <table class="restocking-table">
          <thead>
            <tr>
              <th>{{ t('restocking.table.sku') }}</th>
              <th>{{ t('restocking.table.itemName') }}</th>
              <th>{{ t('restocking.table.category') }}</th>
              <th>{{ t('restocking.table.warehouse') }}</th>
              <th class="num">{{ t('restocking.table.currentStock') }}</th>
              <th class="num">{{ t('restocking.table.reorderPoint') }}</th>
              <th class="num">{{ t('restocking.table.qtyToOrder') }}</th>
              <th class="num">{{ t('restocking.table.unitCost') }}</th>
              <th class="num">{{ t('restocking.table.totalCost') }}</th>
              <th>{{ t('restocking.table.priority') }}</th>
              <th>{{ t('restocking.table.reason') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recommendations" :key="item.item_sku">
              <td><strong>{{ item.item_sku }}</strong></td>
              <td>{{ item.item_name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.warehouse }}</td>
              <td class="num">{{ item.current_stock }}</td>
              <td class="num">{{ item.reorder_point }}</td>
              <td class="num"><strong>{{ item.quantity_to_order }}</strong></td>
              <td class="num">{{ formatCurrency(item.unit_cost) }}</td>
              <td class="num"><strong>{{ formatCurrency(item.total_cost) }}</strong></td>
              <td>
                <span :class="['badge', `priority-${item.priority}`]">
                  {{ t(`restocking.priority.${item.priority}`) }}
                </span>
              </td>
              <td>
                <span :class="['reason-label', `reason-${item.reason}`]">
                  {{ t(`restocking.reason.${item.reason}`) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t } = useI18n()
    const { selectedLocation } = useFilters()

    const loading = ref(false)
    const error = ref(null)
    const recommendations = ref([])
    const budgetInput = ref('')

    const totalCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.total_cost, 0)
    )

    const budgetRemaining = computed(() =>
      budgetInput.value ? parseFloat(budgetInput.value) - totalCost.value : null
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockingRecommendations({
          warehouse: selectedLocation.value,
          budget: budgetInput.value || undefined
        })
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch(selectedLocation, loadData)
    onMounted(loadData)

    const formatCurrency = (num) =>
      Number(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    return {
      t, loading, error, recommendations, budgetInput,
      totalCost, budgetRemaining, loadData, formatCurrency
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-row {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 1.5rem;
  background: white; border-radius: 12px; padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.budget-input-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.budget-label { font-size: 0.875rem; font-weight: 600; color: #64748b; white-space: nowrap; }
.budget-field { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.currency-prefix { padding: 0 10px; background: #f8fafc; color: #64748b; font-size: 0.875rem; border-right: 1px solid #e2e8f0; height: 38px; display: flex; align-items: center; }
.budget-input { border: none; outline: none; padding: 0 12px; height: 38px; font-size: 0.875rem; width: 160px; }
.btn-primary { background: #3b82f6; color: white; border: none; padding: 0 20px; height: 38px; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #2563eb; }

.budget-summary { display: flex; gap: 12px; flex-wrap: wrap; }
.summary-chip { border-radius: 8px; padding: 6px 14px; display: flex; flex-direction: column; align-items: flex-end; }
.summary-chip.total { background: #eff6ff; border: 1px solid #bfdbfe; }
.summary-chip.remaining { background: #f0fdf4; border: 1px solid #bbf7d0; }
.summary-chip.over { background: #fef2f2; border: 1px solid #fecaca; }
.chip-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
.chip-value { font-size: 1rem; font-weight: 700; color: #0f172a; }

.card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.table-container { overflow-x: auto; }

.restocking-table { width: 100%; border-collapse: collapse; }
.restocking-table th {
  background: #f8fafc; padding: 0.75rem; text-align: left;
  font-weight: 600; font-size: 0.8rem; color: #64748b;
  border-bottom: 2px solid #e2e8f0; white-space: nowrap;
}
.restocking-table th.num { text-align: right; }
.restocking-table td { padding: 0.75rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }
.restocking-table td.num { text-align: right; }
.restocking-table tr:hover { background: #f8fafc; }

.badge { padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.priority-critical { background: #fee2e2; color: #991b1b; }
.priority-high { background: #fef3c7; color: #92400e; }
.priority-medium { background: #dbeafe; color: #1e40af; }
.priority-low { background: #f1f5f9; color: #475569; }

.reason-label { font-size: 0.8rem; color: #64748b; }
.reason-backlog_critical { color: #dc2626; font-weight: 600; }
.reason-demand_spike { color: #d97706; font-weight: 600; }
.reason-low_stock { color: #2563eb; }

.empty-state { text-align: center; padding: 4rem; color: #64748b; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.loading { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; margin: 1rem 0; display: flex; align-items: center; justify-content: space-between; }
.retry-btn { background: #991b1b; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem; }
</style>
