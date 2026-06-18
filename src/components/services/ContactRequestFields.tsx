import React from "react"
import {
  budgetOptions,
  requestTypeOptions,
  urgencyOptions,
} from "../../content/services"

type ContactRequestFieldsProps = {
  requestType: string
  urgency: string
  budget: string
  websiteUrl: string
  websiteUrlError?: string
  disabled?: boolean
  onRequestTypeChange: (value: string) => void
  onUrgencyChange: (value: string) => void
  onBudgetChange: (value: string) => void
  onWebsiteUrlChange: (value: string) => void
}

const selectClass =
  "w-full rounded-xl border border-[var(--v2-line-strong)] bg-[var(--v2-panel-2)] px-4 py-3 text-[var(--v2-text)] transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--v2-brand)]"

const labelClass = "mb-2 block text-sm font-medium text-[var(--v2-muted)]"

const ContactRequestFields: React.FC<ContactRequestFieldsProps> = ({
  requestType,
  urgency,
  budget,
  websiteUrl,
  websiteUrlError,
  disabled,
  onRequestTypeChange,
  onUrgencyChange,
  onBudgetChange,
  onWebsiteUrlChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="requestType" className={labelClass}>
            Request type
          </label>
          <select
            id="requestType"
            name="requestType"
            value={requestType}
            onChange={(e) => onRequestTypeChange(e.target.value)}
            disabled={disabled}
            className={selectClass}
          >
            <option value="">Select request type (optional)</option>
            {requestTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="urgency" className={labelClass}>
            Urgency
          </label>
          <select
            id="urgency"
            name="urgency"
            value={urgency}
            onChange={(e) => onUrgencyChange(e.target.value)}
            disabled={disabled}
            className={selectClass}
          >
            <option value="">Select urgency (optional)</option>
            {urgencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className={labelClass}>
            Budget range
          </label>
          <select
            id="budget"
            name="budget"
            value={budget}
            onChange={(e) => onBudgetChange(e.target.value)}
            disabled={disabled}
            className={selectClass}
          >
            <option value="">Select budget (optional)</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="websiteUrl" className={labelClass}>
            Website URL
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={websiteUrl}
            onChange={(e) => onWebsiteUrlChange(e.target.value)}
            disabled={disabled}
            placeholder="https://yourwebsite.com"
            maxLength={500}
            autoComplete="url"
            inputMode="url"
            className={`${selectClass} ${
              websiteUrlError ? "border-red-500 focus:ring-red-500" : ""
            }`}
            aria-invalid={websiteUrlError ? true : undefined}
            aria-describedby={websiteUrlError ? "websiteUrl-error" : undefined}
          />
          {websiteUrlError && (
            <p
              id="websiteUrl-error"
              role="alert"
              className="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {websiteUrlError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactRequestFields
