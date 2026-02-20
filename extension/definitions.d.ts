
interface HTMLElement {
    assignedCssLabel?: string
}
interface LabelToSolve {
    element: HTMLAnchorElement
    identifier: string
}
type LabelKind = 'associate' | 'none' | '' | 'bad-identifier';
interface JeffreyAssociatesCommand {
    myself?: string
    ids?: string[]
    updateAllLabels?: boolean
    closeCallingTab?: boolean
    setTheme?: string
    confirmSetIdentifier?: string
    confirmSetLabel?: LabelKind
    confirmSetUrl?: string
    badIdentifierReason?: BadIdentifierReason
}
type LabelMap = { [identifier: string]: LabelKind };

interface JeffreyAssociatesMessage extends JeffreyAssociatesCommand {
}

type ContextMenuCommand = 'help' | 'options' | 'separator';
type BadIdentifierReason = 'SN' | 'AR';
interface TwitterMapping {
    userName: string;
    numericId: string;
}
