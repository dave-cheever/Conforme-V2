export interface IComplianceItemModalDialogDetails {
  isOpen: boolean,
  title?: string,
  description?: string,
  state?: string,
  showButtons: boolean,
  action?: () => void,
}
