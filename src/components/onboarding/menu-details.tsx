import React, {
  ChangeEvent,
  Dispatch,
  Ref,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FormData } from "./RestaurantSetup";
import { AppWindowMac, BadgePlus, ScanLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Type for handling the input change
export type HandleInputChange = (
  field: keyof FormData,
  value: string | FormData["menuDetails"]
) => void;

// When the menu details are empty
function NoMenuDetails({
  setShowManualEntry,
  handleInputChange,
}: {
  setShowManualEntry: Dispatch<SetStateAction<boolean>>;
  handleInputChange: HandleInputChange;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/client/api/v1/extract-menu-data", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract menu data");
      }

      const data = (await response.json()) as {
        sucess: boolean;
        data: FormData["menuDetails"];
      };
      handleInputChange("menuDetails", data.data);
      setShowManualEntry(false);
    } catch (error) {
      console.error("Error in extracting menu data:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4", {
        "pointer-events-none": loading,
      })}
    >
      {/* AI */}
      <div
        className="group relative flex flex-col justify-center items-center h-full w-full bg-primary-50 border-2 border-primary rounded-lg cursor-pointer hover:bg-primary-100 hover:border-primary-600 transition-colors duration-300 ease-in-out p-8 text-center"
        onClick={() => !loading && inputRef.current?.click()}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col justify-center items-center rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-primary font-semibold mt-4">Extracting...</p>
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="application/pdf, image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        <div className="absolute top-2 right-2 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
          AI Extraction
        </div>
        <ScanLine className="text-primary h-10 w-10 mb-4" />
        <h3 className="text-lg font-semibold text-primary">
          Extract Menu from Image
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Upload a photo of your menu to get started.
        </p>
      </div>

      {/* Manual entry */}
      <div
        className="group flex flex-col justify-center items-center h-full w-full bg-background-surface border border-border-default rounded-lg cursor-pointer hover:bg-background-muted hover:border-border-dark transition-colors duration-300 ease-in-out p-8 text-center"
        onClick={() => !loading && setShowManualEntry(true)}
      >
        <BadgePlus className="text-text-secondary h-10 w-10 mb-4" />
        <h3 className="text-lg font-semibold text-text-primary">
          Add Items Manually
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Enter your menu items one-by-one
        </p>
      </div>
    </div>
  );
}

// Form to manually add menu items
function ManualEntryForm({
  onAddItem,
  onCancel,
}: {
  onAddItem: (item: FormData["menuDetails"][0]) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && price) {
      onAddItem({ name, price, description });
      setName("");
      setPrice("");
      setDescription("");
    }
  };

  return (
    <div className="w-full h-full p-4 bg-background-surface rounded-lg border border-border-default">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Add New Menu Item
        </h3>
        <div>
          <label
            htmlFor="itemName"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Item Name
          </label>
          <Input
            id="itemName"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder="e.g., Classic Burger"
            required
          />
        </div>
        <div>
          <label
            htmlFor="itemPrice"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Price
          </label>
          <Input
            id="itemPrice"
            type="number"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
            placeholder="e.g., 12.99"
            required
          />
        </div>
        <div>
          <label
            htmlFor="itemDescription"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Optional Description
          </label>
          <Input
            id="itemDescription"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            placeholder="e.g., Served with lettuce, tomato, and fries"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Item
          </Button>
        </div>
      </form>
    </div>
  );
}

// Single menu item component
function MenuItem({
  item,
  onDelete,
}: {
  item: FormData["menuDetails"][0];
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-between items-start p-3 bg-background-surface rounded-md border border-gray-300">
      <div>
        <p className="font-semibold text-text-primary">{item.name}</p>
        {item.description && (
          <p className="text-sm text-text-secondary">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <p className="font-medium text-text-primary">
          ${Number(item.price).toFixed(2)}
        </p>
        <button
          onClick={onDelete}
          className="text-danger opacity-60 hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

// Parent Component
function MenuDetails({
  handleInputChange,
  menuDetails,
}: {
  menuDetails: FormData["menuDetails"];
  handleInputChange: HandleInputChange;
}) {
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);

  const handleAddItem = (newItem: FormData["menuDetails"][0]) => {
    const updatedMenu = [...menuDetails, newItem];
    handleInputChange("menuDetails", updatedMenu);
    setShowManualEntry(false);
  };

  const handleDeleteItem = (index: number) => {
    const updatedMenu = menuDetails.filter((_, i) => i !== index);
    handleInputChange("menuDetails", updatedMenu);
  };

  const hasItems = menuDetails.length > 0;

  return (
    <div className="w-full min-h-40 flex ">
      {showManualEntry ? (
        <ManualEntryForm
          onAddItem={handleAddItem}
          onCancel={() => setShowManualEntry(false)}
        />
      ) : hasItems ? (
        <div className="w-full p-4 bg-background-muted/50 rounded-lg border border-border-default space-y-3 ">
          <div className="flex justify-between items-center pb-2 border-b border-border-light">
            <h3 className="text-lg font-semibold text-text-primary">
              Menu Items
            </h3>
            <Button
              variant="primary"
              size="sm"
              className="cursor-pointer"
              onClick={() => setShowManualEntry(true)}
            >
              <BadgePlus size={16} className="mr-2" />
              Add Item
            </Button>
          </div>
          <div className="max-h-112 overflow-scroll flex flex-col gap-2 px-1">
            {menuDetails.map((item, index) => (
              <MenuItem
                key={index}
                item={item}
                onDelete={() => handleDeleteItem(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <NoMenuDetails
          setShowManualEntry={setShowManualEntry}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
}

export default MenuDetails;
