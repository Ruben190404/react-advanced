import { useState, useEffect } from "react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText
} from "../components/ui/select";

export const Filter = ({events, setSearchResults, categories}) => {
    const [filter, setFilter] = useState([]);

    const handleInput = () => {
        if(Object.keys(filter).length != 0){
            setSearchResults(events.filter((event) => 
                event.categoryIds.some((id) => filter.includes(String(id)))
            ));
        } else {
            setSearchResults(events);
        }
    };

    useEffect(() => {
        handleInput();
    }, [filter]);
    
    return (
        <SelectRoot multiple collection={categories} onValueChange={(e) => setFilter(e.value)}  maxW={'400px'} width={'95vw'}>
            <SelectLabel>Select Category</SelectLabel>
            <SelectTrigger clearable backgroundColor={'white'}>
                <SelectValueText placeholder="Select Category"  textTransform={"capitalize"}/>
            </SelectTrigger>
            {categories && Object.keys(categories).length > 0 &&
                <SelectContent>
                {categories.items.map((category) => (
                    <SelectItem item={category} key={category.value} textTransform={"capitalize"}>
                    {category.label}
                </SelectItem>
                ))}
                </SelectContent>
            }
        </SelectRoot>
    )
}