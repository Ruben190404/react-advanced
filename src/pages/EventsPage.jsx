"use client"

import React from 'react';
import { Heading, For, Text, Image, Card, Flex, Center, createListCollection, Badge, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/EventForm';
import { SearchBar } from '../components/SearchBar';
import { Filter } from '../components/Filter';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const response = await fetch('http://localhost:3000/events');
    const data = await response.json();
    setEvents(await data);
  }

  const fetchCategories = async () => {
    const response = await fetch('http://localhost:3000/categories');
    let data = await response.json();
    const formattedData = {
      items: data.map(item => ({
        label: item.name,
        value: item.id 
      }))
    };
    setCategories(createListCollection(await formattedData));
  }

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [])

  useEffect(() => {
    setSearchResults(events);
  }, [events])

  const routeToEvent = (id) => {
    navigate('/event/'+id);
  };

  const returnDateFormat = (datetime) =>{
    return new Date(datetime).toLocaleString();
  }

  const parseCategories = (categoryIds) => {
    if (!categories || !categories.items || !Array.isArray(categories.items)) {
      return [];
    }
    if(categories && categoryIds){
      let catStrings = Object.values(categoryIds).map((cat) => {
        if (typeof cat !== "number" || cat < 1 || cat > categories.items.length) {
          return "Unknown Category";
        }
        return categories['items'][cat-1]['label'];
      });
      return catStrings;
    } 
  }

  return (
    <Center minH={'100vh'} flexDir={'column'} gap={'40px'} alignContent={'center'} justifyContent={'start'} backgroundColor={'gray.100'} marginTop={'2rem'}>
      <Heading>List of events</Heading>
      <SearchBar events={events} setSearchResults={setSearchResults}/>
      {categories && Object.keys(categories).length > 0 &&
        <Filter events={events} setSearchResults={setSearchResults} categories={categories}/>
      }
      <EventForm setSearchResults={setSearchResults} setEvents={setEvents} categories={categories} edit={false} event={false} reloadEvent={false}/>
      {searchResults &&
      <Flex direction={'row'} wrap={'wrap'} maxW={'1340px'} gap={'20px'} marginTop={'2rem'} justifyContent={'start'} alignContent={'start'}>
        <For each={searchResults}>
          {(event, index) => (
            <Card.Root key={index} overflow={'hidden'} width={'clamp(50px, 80vw, 320px)'} height={'auto'} maxH={'500px'} cursor={'pointer'} onClick={() => routeToEvent(event.id)} borderRadius={'15px'} boxShadow={'lg'}>
              <Image src={event.image} maxH={'200px'}/>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Text>{event.description}</Text>
                <Text>{returnDateFormat(event.startTime)}</Text>
                <Text>{returnDateFormat(event.endTime)}</Text>
                <HStack>{categories && categories.items && Object.values(parseCategories(event.categoryIds)).map((c, index) => {
                  return (
                  <Badge key={index} colorPalette="purple">
                    {c}
                  </Badge>)
                })}</HStack>
              </Card.Body>
            </Card.Root>
          )}
        </For>
      </Flex>
      }
    </Center>
  );
};
