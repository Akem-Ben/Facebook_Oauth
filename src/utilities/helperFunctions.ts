import axios from "axios";
import { ADMIN_FACEBOOK_PAGE_ID, FETCH_ADMIN_CONVERSATIONS_DETAILS_URI, MY_LONG_LIVED_ACCESS_TOKEN } from "../keys";

export function formatTimeFromISO(isoString: Date): string {
    // Parse the ISO string to a Date object
    const date = new Date(isoString);
    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // Format minutes to always have two digits
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    // Combine into final formatted string
    const formattedTime = `${hours}:${minutesStr}${ampm}`;
    return formattedTime;
  }
  
  export const formatDate = (isoString: Date): string => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };

export const isClient = () => {
  return typeof window !== 'undefined' && 'localStorage' in window;
};

export const fetchAdminConversationsIds = async() => {
  try{
    const getData = await axios.get(`${FETCH_ADMIN_CONVERSATIONS_DETAILS_URI}/${ADMIN_FACEBOOK_PAGE_ID}/conversations?platform=instagram&access_token=${MY_LONG_LIVED_ACCESS_TOKEN}`)
    const conversations = getData.data.data
    return conversations
  }catch(error:any){
    console.log(error.message)
  }
}