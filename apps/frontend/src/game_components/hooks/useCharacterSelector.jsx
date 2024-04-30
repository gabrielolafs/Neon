import { useState, useCallback, useEffect } from "react";
import { allCharacters } from "../Characters";

const SelectionStatus = {
  unselected: 0,
  selected: 1,
};

export function useCharacterSelector(initialIndex) {
  const [index, setIndex] = useState(initialIndex);
  const [activeArrowKey, setActiveArrowKey] = useState(null);
  const itemCount = allCharacters.length;
  const [selectedStatus, setSelectedStatus] = useState(
    SelectionStatus.unselected,
  );

  const firstRowSize = 7;
  const secondRowSize = 6;

  const setIndexSafely = useCallback(
    (newIndex) => {
      setIndex((newIndex + itemCount) % itemCount);
    },
    [itemCount],
  );

  const movePrev = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowLeft") {
      setActiveArrowKey("ArrowLeft");
      setIndexSafely(index - 1);
    }
  }, [index, activeArrowKey, setIndexSafely]);

  const moveNext = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowRight") {
      setActiveArrowKey("ArrowRight");
      setIndexSafely(index + 1);
    }
  }, [index, activeArrowKey, setIndexSafely]);

  const moveUp = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowUp") {
      setActiveArrowKey("ArrowUp");
      if (index >= firstRowSize) {
        const newIndex = index - secondRowSize;
        setIndexSafely(newIndex);
      }
    }
  }, [index, activeArrowKey, firstRowSize, secondRowSize, setIndexSafely]);

  const moveDown = useCallback(() => {
    if (!activeArrowKey || activeArrowKey === "ArrowDown") {
      setActiveArrowKey("ArrowDown");
      if (index === 0) {
        setIndexSafely(7);
      } else if (index < firstRowSize) {
        const newIndex = index + secondRowSize;
        setIndexSafely(newIndex);
      }
    }
  }, [index, activeArrowKey, firstRowSize, secondRowSize, setIndexSafely]);

  const keyboardEnter = useCallback(() => {
    if (selectedStatus === SelectionStatus.unselected) {
      setSelectedStatus(SelectionStatus.selected);
    } else {
      window.location.href = `/brigham-breakout?characterIndex=${index}`;
    }
  }, [selectedStatus, index]);

  const keyboardEscape = useCallback(() => {
    setSelectedStatus(SelectionStatus.unselected);
  }, []);

  const setCurrentIndex = useCallback(
    (newIndex) => {
      setIndexSafely(newIndex);
    },
    [setIndexSafely],
  );

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowLeft":
          movePrev();
          break;
        case "ArrowRight":
          moveNext();
          break;
        case "ArrowUp":
          moveUp();
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "Enter":
          keyboardEnter();
          break;
        case "Escape":
          keyboardEscape();
          break;
        default:
          break;
      }
    },
    [movePrev, moveNext, moveUp, moveDown, keyboardEnter, keyboardEscape],
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (event.key === activeArrowKey) {
        setActiveArrowKey(null);
      }
    },
    [activeArrowKey],
  );

  useEffect(() => {
    // Add event listeners for key down and key up events
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getCharacter = useCallback(() => {
    return allCharacters[index];
  }, [index]);

  return {
    currentIndex: index,
    setCurrentIndex,
    movePrev,
    moveNext,
    moveUp,
    moveDown,
    getCharacter,
    selectedStatus,
  };
}
