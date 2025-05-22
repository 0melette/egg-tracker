// components/QuailProfileModal.tsx

import Image from 'next/image';
import { QuailProfile } from '../data/quailData'; // Assuming QuailProfile defines the core data

// Props for the modal
interface QuailProfileModalProps {
  quail: QuailProfile; // The selected quail to display (must be a full profile)
  onClose: () => void;
  styles: Record<string, string>; // For CSS Modules
}

export default function QuailProfileModal({ quail, onClose, styles }: QuailProfileModalProps) {
  // The `quail` prop is already guaranteed to be non-null by the calling component's logic
  // if the modal is open.

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        {quail.imageSrc && (
          <div className={styles.modalImageContainer}>
            <Image
              src={quail.imageSrc}
              alt={quail.name}
              width={150}
              height={150}
              className={styles.modalImage}
            />
          </div>
        )}
        <h2 className={styles.modalTitle}>{quail.name}</h2>
        <div className={styles.modalDetails}>
          <p><strong>Sex:</strong> {quail.sex}</p>
          <p><strong>Favorite Food:</strong> {quail.favoriteFood}</p>
          <p><strong>Bio:</strong> {quail.bio}</p>
        </div>
      </div>
    </div>
  );
}
