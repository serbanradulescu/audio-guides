"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import useSWR from "swr";
import { useOrganization } from "@clerk/nextjs";
import { addExhibitItem, getExhibitItems } from "@/lib/exhibitItems";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Updated schema without ownerId and language
const formSchema = z.object({
  itemNumber: z.string().min(1, { message: "Item number is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export function AddExhibitItem() {
  const [open, setOpen] = useState(false);
  const { organization, isLoaded } = useOrganization();
  const { data: items, mutate } = useSWR(
    isLoaded && organization ? ["exhibitItems", organization.id] : null,
    getExhibitItems
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemNumber: items ? (items.length + 1).toString() : "1", // Default to the next item number
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await addExhibitItem({
        itemNumber: values.itemNumber,
        language: "en", // Default language
        title: values.title,
        description: values.description,
      });
      await mutate(); // Refresh the exhibit items list

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding exhibit item:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Exhibit Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Exhibit Item</DialogTitle>
          <DialogDescription>
            Create a new exhibit item with the required information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="itemNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique identifier for this exhibit item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Exhibit title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the exhibit item"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("itemNumber") &&
              items &&
              items.some(
                (item) => item.itemNumber === form.watch("itemNumber")
              ) && (
                <p className="text-sm text-red-600">
                  An item with this number already exists.
                </p>
              )}
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  items &&
                  items.some(
                    (item) => item.itemNumber === form.watch("itemNumber")
                  )
                }
              >
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
