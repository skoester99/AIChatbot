import { NextResponse } from 'next/server';
import { exec } from 'child_process';


// Function to fetch chat response from the API
const fetchChatResponse = async (message) => {
  try {
    const response = await fetch('https://infinite-gpt.p.rapidapi.com/infinite-gpt', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY, 
        'x-rapidapi-host': 'infinite-gpt.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message, // Send the user message to the API
        sysMsg: 'You are a friendly Chatbot.', // System message for context
      }),
    });

    if (!response.ok) {
      console.error(`API request failed with status ${response.status} (${response.statusText})`);
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('API response:', data.msg);

    return data.msg; // Return the response from the API
  } catch (error) {
    console.error('Error in fetchChatResponse:', error);
    throw error;
  }
};

// POST function to handle incoming requests
export async function POST(req) {
  try {
    const { query } = await req.json(); // Extract query from the request body

    // Fetch the chat response
    const chatResponse = await fetchChatResponse(query);

    // Log the chat response for debugging
    console.log('Incoming request data:', chatResponse);

    // Return the chat response as JSON
    return NextResponse.json(chatResponse);
  } catch (error) {
    // Handle errors and return a 500 status
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Failed to generate a response' }, { status: 500 });
  }
}