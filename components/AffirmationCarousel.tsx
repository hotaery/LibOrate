import React, { useState, useRef, useEffect } from "react";
import {
  AffirmationCardContent,
  AffirmationCard,
} from "@/components/AffirmationCard";
import { AddNewAffirmationCard } from "@/components/AddNewAffirmationCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import "@/app/css/Affirmation.css";

interface AffirmationCarouselProps {
  initialAffirmations: AffirmationCardContent[];
}

export function AffirmationCarousel({
  initialAffirmations,
}: AffirmationCarouselProps) {
  const [affirmationList, setAffirmationList] = useState(initialAffirmations);
  const [height, setHeight] = useState<number>(100); // Default height
  const isResizing = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const updateAffirmationCard = (id: number, updatedText: string) => {
    // TODO: log updated AffirmationList in DB
    const updatedAffirmationList = affirmationList.map((affirmation) => {
      if (affirmation.id == id) {
        return { id: id, text: updatedText };
      } else {
        return affirmation;
      }
    });
    setAffirmationList(updatedAffirmationList);
  };

  // TODO: propogate the change to root to delete card in DB
  const deleteAffirmationCard = (id: number) => {
    setAffirmationList(affirmationList.filter((a) => a.id != id));
  };

  // TODO: propogate the change to root to add new card to DB
  const addAffirmationCard = (cardText: string) => {
    let maxId = -1;
    affirmationList.forEach((card) => {
      if (card.id > maxId) {
        maxId = card.id;
      }
    });
    const newCard = { id: maxId + 1, text: cardText };
    setAffirmationList([...affirmationList, newCard]);
  };

  useEffect(() => {
    if (carouselRef.current) {
      setHeight(carouselRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    let prevY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (isResizing.current) {
        const movementY = event.movementY
          ? event.movementY
          : event.clientY - prevY;
        prevY = event.clientY;
        const newHeight = Math.max(80, Math.min(height + movementY, 300));
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.userSelect = "auto";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [height]);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
  };

  return (
    <Carousel>
      <CarouselContent
        className="self-affirm-carousel"
        style={{ height: `${height}px` }}
        ref={carouselRef}
      >
        {affirmationList.map((affirmation) => (
          <CarouselItem key={affirmation.text}>
            <AffirmationCard
              initialContent={affirmation}
              onAffirmationCardUpdate={updateAffirmationCard}
              onAffirmationCardDeletion={deleteAffirmationCard}
            />
          </CarouselItem>
        ))}
        <CarouselItem key="add-new-card">
          <AddNewAffirmationCard onCardAdd={addAffirmationCard} />
        </CarouselItem>
      </CarouselContent>
      <div className="resize-handle" onMouseDown={handleMouseDown} />
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
