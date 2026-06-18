import React from "react"
import { useTheme } from "../../context/ThemeContext"
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

const selectClass = (isDark: boolean) =>
  `w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:border-transparent ${
    isDark
      ? "bg-slate-700 text-white border-slate-600 focus:ring-green-500"
      : "bg-white text-slate-900 border-slate-300 focus:ring-green-500"
  }`

const labelClass = (isDark: boolean) =>
  `block text-sm font-medium mb-2 ${
    isDark ? "text-slate-300" : "text-slate-700"
  }`

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
  const { isDark } = useTheme()

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="requestType" className={labelClass(isDark)}>
            Request type
          </label>
          <select
            id="requestType"
            name="requestType"
            value={requestType}
            onChange={(e) => onRequestTypeChange(e.target.value)}
            disabled={disabled}
            className={selectClass(isDark)}
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
          <label htmlFor="urgency" className={labelClass(isDark)}>
            Urgency
          </label>
          <select
            id="urgency"
            name="urgency"
            value={urgency}
            onChange={(e) => onUrgencyChange(e.target.value)}
            disabled={disabled}
            className={selectClass(isDark)}
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
          <label htmlFor="budget" className={labelClass(isDark)}>
            Budget range
          </label>
          <select
            id="budget"
            name="budget"
            value={budget}
            onChange={(e) => onBudgetChange(e.target.value)}
            disabled={disabled}
            className={selectClass(isDark)}
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
          <label htmlFor="websiteUrl" className={labelClass(isDark)}>
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
            className={`${selectClass(isDark)} ${
              websiteUrlError ? "border-red-500 focus:ring-red-500" : ""
            }`}
            aria-invalid={websiteUrlError ? true : undefined}
            aria-describedby={websiteUrlError ? "websiteUrl-error" : undefined}
          />
          {websiteUrlError && (
            <p id="websiteUrl-error" className="mt-2 text-sm text-red-500">
              {websiteUrlError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactRequestFields
