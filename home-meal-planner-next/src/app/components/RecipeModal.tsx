'use client'
import { Recipe } from "../recipes";
import { Button } from "./Button";
import { Modal } from "./Modal";
import React from "react";

interface RecipeModalProps {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

export function RecipeModal({ recipe, open, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative">
        <Button
          variant="ghost"
          className="absolute -top-4 -right-4 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
          aria-label="Sulje"
        >
          ×
        </Button>
        <h2 className="text-lg font-bold mb-2">{recipe.title}</h2>
        <div className="text-sm text-gray-600 mb-2">{recipe.text}</div>
        {recipe.links.length > 0 && (
          <div className="mb-2">
            <div className="font-semibold text-xs mb-1">Linkit:</div>
            <div className="flex flex-col gap-1 text-sm">
              {recipe.links.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all block"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="font-semibold text-xs mb-1">Sisältö:</div>
        <ul className="list-disc ml-5">
          {recipe.contents.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </Modal>
  );
} 