import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { AffirmationCarousel } from "../components/AffirmationCarousel";
import "@testing-library/jest-dom"; // Extra matchers for assertions

// 🛠 Mock embla-carousel-react to prevent errors in Jest
jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    scrollNext: jest.fn(),
    scrollPrev: jest.fn(),
  })),
}));

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn(() => [
    jest.fn(), // Carousel ref
    {
      canScrollPrev: jest.fn(() => true),
      canScrollNext: jest.fn(() => true),
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      on: jest.fn(), // Mock the `.on` method
      off: jest.fn(),
      scrollTo: jest.fn(),
      selectedScrollSnap: jest.fn(() => 0),
    },
  ]),
}));

const defaultAffirmations = [
  { id: 0, text: "Say what I want to say, whatever happens will help me grow" },
  { id: 1, text: "I can take up space" },
  { id: 2, text: "I have an important voice" },
  { id: 3, text: "Feel the tension and proceed" },
  { id: 4, text: "I have the right to stutter" },
];

describe("AffirmationCarousel Component", () => {

  test("resizes when the resize handle is dragged", () => {
    const { container } = render(<AffirmationCarousel initialAffirmations={[]} />);

    const resizeHandle = container.querySelector(".resize-handle"); // Ensure resize handle is present
    const carouselContent = container.querySelector(".self-affirm-carousel"); // Ensure content is present

    // Ensure default height is set
    expect(carouselContent.style.height).toBe("0px");

    act(() => {
      fireEvent.mouseDown(resizeHandle); // Start resizing
      fireEvent.mouseMove(document, { clientY : 100 }); // Drag down
      fireEvent.mouseUp(document); // Release mouse
    });

    expect(carouselContent.style.height).toBe("100px");
  });

  test("ensures font size updates correctly on resize", () => {
    const { container } = render(<AffirmationCarousel initialAffirmations={defaultAffirmations} />);


    const resizeHandle = container.querySelector(".resize-handle"); // Ensure resize handle is present
    const firstAffirmationCard = container.querySelector(".self-affirm-text"); // Ensure content is present

    act(() => {
      fireEvent.mouseDown(resizeHandle);
      fireEvent.mouseMove(document, { clientY: 100 }); // Increase height
      fireEvent.mouseUp(document);
    });

    // If height is 150px, fontSize should be 30px (height * 0.2)
    expect(firstAffirmationCard.style.fontSize).toBe("20px");
  });
});