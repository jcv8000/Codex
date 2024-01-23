export type WhatsNewModalState = {
    opened: boolean;
};

export const defaultWhatsNewModalState: WhatsNewModalState = { opened: false };

export function WhatsNewModal(props: { state: WhatsNewModalState; onClose: () => void }) {
    return <></>;
}
