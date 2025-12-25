import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getRandomHue = () => Math.floor(Math.random() * 361); // Generate a random hue between 0 and 360

export function AddHabit() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [hue, setHue] = useState(getRandomHue());
  const [color, setColor] = useState(`hsl(${hue}, 100%, 50%)`); // Start with a random color
  const router = useRouter();

  const handleChange = (value: number) => {
    setHue(value);
    // HSL color: hue value ranges from 0 to 360 with max saturation and lightness
    const newColor = `hsl(${value}, 100%, 50%)`;
    setColor(newColor);
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/habit", {
        name: name,
        color: color,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Habit hinzufügen</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-110">
          <DialogHeader>
            <DialogTitle>Habit hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="Farbe">Farbe</Label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="w-full appearance-none"
                style={{
                  background: `linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`,
                }}
              />
              <div
                className="mt-4 w-full h-10 border"
                style={{ backgroundColor: color }}
              ></div>
              <Button
                onClick={() => handleChange(getRandomHue())}
                className="mt-4"
                variant={"outline"}
              >
                Zufällige Farbe
              </Button>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={name.length > 0 ? false : true}
              onClick={() => handleSave()}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
