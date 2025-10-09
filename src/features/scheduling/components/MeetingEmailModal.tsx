import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Mode, MeetingRequest, EmailRequest } from '../types'
import { DEFAULT_TIMEZONE, MEETING_DURATIONS } from '../consts'

interface MeetingEmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MeetingRequest | EmailRequest, mode: Mode) => Promise<void>
  suggestedMode?: Mode
  isLoading?: boolean
  error?: string
}

interface FormData {
  userEmail: string
  mode: Mode
  description: string
  date: string
  time: string
  duration: number
}

const MeetingEmailModal: React.FC<MeetingEmailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  suggestedMode = 'email',
  isLoading = false,
  error,
}) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<FormData>({
    userEmail: '',
    mode: suggestedMode,
    description: '',
    date: '',
    time: '',
    duration: 30,
  })
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFormData((prev) => ({ ...prev, mode: suggestedMode }))
      setValidationErrors({})
    }
  }, [isOpen, suggestedMode])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.userEmail.trim()) {
      errors.userEmail = 'Email is required'
    } else if (!validateEmail(formData.userEmail)) {
      errors.userEmail = 'Please enter a valid email address'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {}

    if (formData.mode === 'meeting') {
      if (!formData.date) {
        errors.date = 'Date is required'
      }
      if (!formData.time) {
        errors.time = 'Time is required'
      }

      if (formData.date && formData.time) {
        const meetingDateTime = new Date(`${formData.date}T${formData.time}`)
        const now = new Date()

        if (meetingDateTime <= now) {
          errors.time = 'Meeting time must be in the future'
        }
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return

    try {
      if (formData.mode === 'meeting') {
        // Convert date/time to ISO strings
        const startDateTime = new Date(`${formData.date}T${formData.time}`)
        const endDateTime = new Date(
          startDateTime.getTime() + formData.duration * 60000
        )

        const meetingData: MeetingRequest = {
          userEmail: formData.userEmail,
          dateISO: startDateTime.toISOString(),
          endDateISO: endDateTime.toISOString(),
          description: formData.description,
          attendees: [formData.userEmail, 'mail.kunal71@gmail.com'],
          timezone: DEFAULT_TIMEZONE,
          summary: 'Meeting scheduled via AI Assistant',
          conversation: 'Conversation history will be added by the system',
        }

        await onSubmit(meetingData, 'meeting')
      } else {
        const emailData: EmailRequest = {
          userEmail: formData.userEmail,
          description: formData.description,
          summary: 'Email sent via AI Assistant',
          conversation: 'Conversation history will be added by the system',
        }

        await onSubmit(emailData, 'email')
      }

      onClose()
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {step === 1
              ? 'Schedule Meeting or Send Email'
              : formData.mode === 'meeting'
                ? 'Schedule Meeting'
                : 'Send Email'}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {step === 1 ? (
          <StepContent>
            <FormGroup>
              <Label htmlFor="userEmail">Your Email Address *</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange('userEmail', e.target.value)}
                placeholder="your.email@example.com"
                hasError={!!validationErrors.userEmail}
              />
              {validationErrors.userEmail && (
                <FieldError>{validationErrors.userEmail}</FieldError>
              )}
            </FormGroup>

            <ModeSelector>
              <ModeOption
                selected={formData.mode === 'email'}
                onClick={() => handleInputChange('mode', 'email')}
              >
                <ModeIcon>📧</ModeIcon>
                <ModeTitle>Simple Email</ModeTitle>
                <ModeDescription>
                  Send a summary email with conversation history
                </ModeDescription>
              </ModeOption>

              <ModeOption
                selected={formData.mode === 'meeting'}
                onClick={() => handleInputChange('mode', 'meeting')}
              >
                <ModeIcon>📅</ModeIcon>
                <ModeTitle>Schedule Meeting</ModeTitle>
                <ModeDescription>
                  Book a Google Meet with calendar invite
                </ModeDescription>
              </ModeOption>
            </ModeSelector>

            <ButtonGroup>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              <NextButton
                onClick={handleNext}
                disabled={
                  !formData.userEmail.trim() ||
                  !validateEmail(formData.userEmail)
                }
              >
                Next
              </NextButton>
            </ButtonGroup>
          </StepContent>
        ) : (
          <StepContent>
            {formData.mode === 'meeting' ? (
              <>
                <FormGroup>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    hasError={!!validationErrors.date}
                  />
                  {validationErrors.date && (
                    <FieldError>{validationErrors.date}</FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    hasError={!!validationErrors.time}
                  />
                  {validationErrors.time && (
                    <FieldError>{validationErrors.time}</FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange('duration', parseInt(e.target.value))
                    }
                  >
                    {MEETING_DURATIONS.map((duration) => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <TimezoneInfo>
                  Timezone: {DEFAULT_TIMEZONE.replace('_', ' ')}
                </TimezoneInfo>
              </>
            ) : null}

            <FormGroup>
              <Label htmlFor="description">
                {formData.mode === 'meeting'
                  ? 'Meeting Description'
                  : 'Email Message'}{' '}
                (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder={
                  formData.mode === 'meeting'
                    ? 'Add any additional context for the meeting...'
                    : 'Add any additional message for the email...'
                }
                rows={3}
              />
            </FormGroup>

            <ButtonGroup>
              <BackButton onClick={() => setStep(1)}>Back</BackButton>
              <SubmitButton onClick={handleSubmit} disabled={isLoading}>
                {isLoading
                  ? 'Processing...'
                  : formData.mode === 'meeting'
                    ? 'Schedule Meeting'
                    : 'Send Email'}
              </SubmitButton>
            </ButtonGroup>
          </StepContent>
        )}
      </ModalContent>
    </ModalOverlay>
  )
}

export default MeetingEmailModal

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: ${({ theme }) => theme.spacing.md};
  margin: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  border: 1px solid #fcc;
`

const StepContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ hasError, theme }) => (hasError ? '#e53e3e' : 'rgba(0, 0, 0, 0.2)')};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const FieldError = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const ModeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`

const ModeOption = styled.div<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primary : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  background: ${({ selected, theme }) =>
    selected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(59, 130, 246, 0.05);
  }
`

const ModeIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ModeTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
`

const ModeDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const TimezoneInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`

const BaseButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
`

const CancelButton = styled(BaseButton)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const NextButton = styled(BaseButton)<{ disabled?: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const BackButton = styled(CancelButton)``

const SubmitButton = styled(NextButton)``
