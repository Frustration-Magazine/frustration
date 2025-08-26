import { useEffect } from "react";

export const useModal = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (isOpen) {
      // Cacher la scrollbar
      // document.body.style.overflow = "hidden";

      // Écouter la touche Échap
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        // Restaurer la scrollbar
        // document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  // Fonction pour gérer le clic dans le vide
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return { handleBackdropClick };
};
