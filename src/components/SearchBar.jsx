import { Input } from "@chakra-ui/react";

export const SearchBar = ({events, setSearchResults}) => {
    const handleInput = () => {
        const input = document.querySelector('input');
        const value = input.value
        console.log(events);
        setSearchResults(events.filter((event) => 
            event.title.toLowerCase().includes(value.toLowerCase())
        ));
      }

    return(
        <Input placeholder='Look for an event...' maxW={'400px'} width={'95vw'} backgroundColor={'white'} onInput={handleInput}/>
    );
}