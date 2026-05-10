import { Button } from './Button';
import { Modal } from './Modal';

export function ConfirmDialog({ open, title, description, onClose }: { open: boolean; title: string; description: string; onClose: () => void }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="mb-5 text-sm text-gray-400">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onClose}>Confirm</Button>
      </div>
    </Modal>
  );
}
