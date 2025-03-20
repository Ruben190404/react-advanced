import React, { useEffect, useState } from 'react';
import { Box, 
        Heading, 
        Text, 
        Image, 
        Card, 
        Flex, 
        Button, 
        createListCollection, 
        Dialog, 
        Portal, 
        HStack, 
        VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/EventForm';

export const EventPage = () => {
  const [eventId, setEventId] = useState(null);
  const [event, setEvent] = useState([]);
  const [user, setUser] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryStrings, setCategoryStrings] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const location = window.location.href;
    setEventId(location.substring(location.lastIndexOf('/')+1));
  },[]);

  const fetchEvent = async () => {
    const response = await fetch('http://localhost:3000/events/'+eventId);
    const data = await response.json();
    setEvent(await data);
  }

  const fetchUser = async () => {
    console.log(user);
    const response = await fetch('http://localhost:3000/users/'+event.createdBy);
    const data = await response.json();
    setUser(await data);
    console.log(Object.keys(user).length);

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
    if (eventId) {
      fetchEvent();
    }
  },[eventId]);

  useEffect(() => {    
    fetchCategories();
  },[]);

  useEffect(() => {  
    if (event.createdBy) {  
      fetchUser();
    }
  },[event]);

  useEffect(() => {
    if(event.categoryIds){
      const catStrings = Object.values(event.categoryIds).map((cat) => {
        return categories['items'][cat-1]['label'];
      });
      setCategoryStrings(catStrings);
    }
  },[event]);

  const returnToEvents = () => {
    navigate('/');
  }

  const returnDateFormat = (datetime) =>{
    return new Date(datetime).toLocaleString();
  }

  const confirmDelete = async () => {
    try {
      const deleteEvent = await fetch('http://localhost:3000/events/'+eventId, {
        method: "DELETE",
      });
    } catch (e){
      toaster.create({
        title: "Error ",
        description: e,
      });
    } finally {
      returnToEvents();
    }
  }

  return (
    <>
      <Heading>Event</Heading>
      {event && 
        <Card.Root maxW={'50vw'} margin={'auto'} borderRadius={'0'}>
          <Card.Header margin={'auto'} w={'100%'}>
            <Flex flexDirection={'row'} alignItems={'center'} w={'100%'} justifyContent={'space-between'}>
                <Button onClick={returnToEvents}>Return</Button>
                <Box>
                  <Heading margin={'auto'} size={'3xl'}>{event.title}</Heading>
                  <Text fontSize={'lg'} textAlign={'center'}>{event.description}</Text>
                </Box>
                <Box spaceX={'25px'}>
                  <EventForm w={'1/3'} setSearchResults={false} setEvents={false} categories={categories} edit={true} event={event} reloadEvent={fetchEvent}/>
                  <Dialog.Root role="alertdialog">
                    <Dialog.Trigger asChild>
                      <Button colorPalette={'red'} >Delete Event</Button>
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content>
                          <Dialog.Header>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Body>
                            <p>
                              This action cannot be undone. This will permanently delete your
                              account and remove your data from our systems.
                            </p>
                          </Dialog.Body>
                          <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                              <Button colorPalette="red" onClick={confirmDelete}>Delete</Button>
                            </Dialog.ActionTrigger>
                          </Dialog.Footer>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>
              </Box>
            </Flex>
          </Card.Header>
          <Image maxH={'500px'} src={event.image}/>
          <Card.Body>
            <Flex justifyContent={'space-around'} alignItems={'center'}>
              <Box>
                <VStack>
                  <HStack w={'100%'}>
                    <Text fontSize={'lg'} fontWeight={'bold'}>From:</Text>
                    <Text fontSize={'lg'}>{returnDateFormat(event.startTime)}</Text>
                  </HStack>
                  <HStack w={'100%'}>
                    <Text fontSize={'lg'} fontWeight={'bold'}>Until:</Text>
                    <Text fontSize={'lg'}>{returnDateFormat(event.endTime)}</Text>
                  </HStack>
                </VStack>
                <HStack>
                  <Text fontSize={'lg'} fontWeight={'bold'}>Categor{categoryStrings.length > 1 ? 'ies' : 'y'}:</Text>
                  <Text fontSize={'lg'}>{Object.values(categoryStrings).join(", ")}</Text>
                </HStack>
              </Box>
              
              <Flex alignItems={'center'} gap={'5%'} minW={'20%'} maxW={'25%'}>
              {Object.keys(user).length > 0 &&
              <>
                <Image boxSize="150px" borderRadius="full" src={user.image}/> 
                <Text fontSize={'xl'}>{user.name}</Text> 
              </>
              }
              </Flex>
             
            </Flex>
          </Card.Body>
        </Card.Root>
      }
      
    </>
  );
};
