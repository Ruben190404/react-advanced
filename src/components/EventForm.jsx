import { 
  DialogActionTrigger, 
  DialogBody, 
  DialogCloseTrigger, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogRoot, 
  DialogTitle, 
  DialogTrigger,
  DialogBackdrop } from "../components/ui/dialog";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText
} from "../components/ui/select";
import React, { useEffect } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { Form } from 'react-router-dom';
import { Toaster, toaster } from '../components/ui/toaster';

export  const EventForm = ({setSearchResults, setEvents, categories, edit, event, reloadEvent}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [editId, setEditId] = useState("");

    const contentRef = useRef(null);

    const addEvent = async (e) => {
        e.preventDefault();
    
        const parsedCategories = category.map(cat => Number(cat));

        const event = {
          title: title,
          description: description,
          image: imageUrl,
          categoryIds: parsedCategories,
          location: location,
          startTime: startDate,
          endTime: endDate
        };
        createEvent(event);

        setTitle("");
        setDescription("");
        setImageUrl("");
        setLocation("");
        setCategory([]);
        setStartDate("");
        setEndDate("");
    }

    const createEvent = async event => {
        const response = await fetch("http://localhost:3000/events", {
            method: "POST",
            body: JSON.stringify(event),
            headers: { "Content-Type": "application/json;charset=utf-8" },
        });
        event.id = (await response.json()).id;
        setEvents(prevEvents => [...prevEvents, event]);
        setSearchResults(prevResults => [...prevResults, event]);
    }

    const editEvent = async (e) => {
        e.preventDefault();

        const parsedCategories = category.map(cat => Number(cat));
      
        const event = {
            id: String(editId),
            title: title,
            description: description,
            image: imageUrl,
            categoryIds: parsedCategories,
            location: location,
            startTime: startDate,
            endTime: endDate
        };
        updateEvent(event);

    }

    const updateEvent = async event => {
        try {
            const response = await fetch("http://localhost:3000/events/"+editId, {
            method: "PATCH",
            body: JSON.stringify(event),
            headers: { "Content-Type": "application/json;charset=utf-8" },
            });
            event.id = (await response.json()).id;
            toaster.create({
                title: "Success ",
                description: "Your event as been saved!!",
              })
        } catch (e){
            toaster.create({
                title: "Error ",
                description: e,
              });
        } finally {
            if(reloadEvent != false){
                reloadEvent();
            }
        }
        
    }

    useEffect(() => {
        if(event != false){
            setEditId(event.id);
            setTitle(event.title);
            setDescription(event.description);
            setImageUrl(event.image);
            setLocation(event.location);  
            setStartDate(event.startDate);
            setEndDate(event.endDate);
            if (categories?.items?.length > 0 && event?.categoryIds?.length > 0) {
                const matchedCategories = categories.items.filter(c =>
                    event.categoryIds.map(id => parseInt(id)).includes(parseInt(c.value))
                );

                if (matchedCategories.length > 0) {
                    setCategory([matchedCategories[0].value]);
                } else {
                    setCategory([]);
                }
            }
        }
    }, [event])

    return (
        <>
        <DialogRoot>
            <DialogBackdrop />
            <DialogTrigger asChild>
                <Button>{edit ? 'Edit Event' : 'Add Event'}</Button>
            </DialogTrigger>
                <DialogContent ref={contentRef}>
                    <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                    <Form onSubmit={addEvent}>
                        <Input placeholder='Title...' onChange={(e) => setTitle(e.target.value)} value={title}/>
                        <Input placeholder='Description...' onChange={(e) => setDescription(e.target.value)} value={description}/>
                        <Input placeholder='Image Url...' onChange={(e) => setImageUrl(e.target.value)} value={imageUrl}/>
                        <SelectRoot multiple collection={categories} onValueChange={(e) => setCategory(e.value)} value={category}>
                            <SelectLabel>Select Category</SelectLabel>
                            <SelectTrigger clearable>
                                <SelectValueText placeholder="Select Category" textTransform={"capitalize"}/>
                            </SelectTrigger>
                            {categories && Object.keys(categories).length > 0 &&
                                <SelectContent portalRef={contentRef}>
                                {categories.items.map((category) => (
                                    <SelectItem item={category} key={category.value} textTransform={"capitalize"}>
                                    {category.label}
                                </SelectItem>
                                ))}
                                </SelectContent>
                            }
                        </SelectRoot>
                        <Input placeholder='Location...' onChange={(e) => setLocation(e.target.value)} value={location}/>
                        <Input type='datetime-local' placeholder='Start Time...' onChange={(e) => setStartDate(e.target.value)} value={startDate}/>
                        <Input type='datetime-local' placeholder='End Time...' onChange={(e) => setEndDate(e.target.value)} value={endDate}/>
                    </Form>
                    </DialogBody>
                    <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant={'outline'}>Close</Button>
                    </DialogActionTrigger>
                    {edit == false &&
                        <DialogActionTrigger asChild>
                            <Button onClick={addEvent}>Add Event</Button>
                        </DialogActionTrigger>
                    }
                    {edit == true &&
                        <DialogActionTrigger asChild>
                            <Button onClick={editEvent}>Edit Event</Button>
                        </DialogActionTrigger>
                    }
                    </DialogFooter>
                    <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
        <Toaster />
        </>
    );
}