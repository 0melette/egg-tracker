import { GoogleAuth } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';
import { DayData, Egg, EggData } from './data-service';

// Set up Google Sheets API
const auth = new GoogleAuth({
  credentials: {
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

// Read egg data from Google Sheets
export async function readEggDataFromSheets(): Promise<EggData> {
  try {
    // Get data from 'Eggs' sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Eggs!A2:D', // Assuming headers are in row 1
    });

    const rows = response.data.values || [];
    const eggData: EggData = { eggs: [] };
    
    // Process rows into our data structure
    // Expected format: Date | Weight | Color | Speckled (true/false)
    const dateMap = new Map<string, Egg[]>();
    
    rows.forEach(row => {
      if (row.length >= 3) {
        const date = row[0];
        const weight = Number(row[1]);
        const color = row[2];
        const speckled = row[3] === 'true';
        
        const egg: Egg = { weight, color, speckled };
        
        if (dateMap.has(date)) {
          dateMap.get(date)?.push(egg);
        } else {
          dateMap.set(date, [egg]);
        }
      }
    });
    
    // Convert map to array of DayData
    dateMap.forEach((eggs, date) => {
      eggData.eggs.push({ date, eggs });
    });
    
    // Sort the data by date (newest first)
    eggData.eggs.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return eggData;
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    throw error;
  }
}

// Function to get the last N days of data from Sheets
export async function getLastNDaysFromSheets(n = 7): Promise<DayData[]> {
  try {
    const data = await readEggDataFromSheets();
    return data.eggs.slice(0, n);
  } catch (error) {
    console.error('Error getting last N days from sheets:', error);
    // Return empty array on error
    return [];
  }
}

// Add eggs to Google Sheets
export async function addEggsToSheets(date: string, eggs: Egg[]): Promise<void> {
  try {
    // Prepare rows to append to the spreadsheet
    const rows = eggs.map(egg => [
      date,
      egg.weight.toString(),
      egg.color,
      egg.speckled ? 'true' : 'false'
    ]);
    
    // Append rows to the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Eggs!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows
      }
    });
  } catch (error) {
    console.error('Error adding eggs to Google Sheets:', error);
    throw error;
  }
}

// Update an egg in the Google Sheet
export async function updateEggInSheets(
  rowIndex: number, 
  egg: { weight: number; color: string; speckled?: boolean }
): Promise<void> {
  try {
    // Update the row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Eggs!B${rowIndex + 2}:D${rowIndex + 2}`, // +2 because row 1 is headers
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          egg.weight.toString(),
          egg.color,
          egg.speckled ? 'true' : 'false'
        ]]
      }
    });
  } catch (error) {
    console.error('Error updating egg in Google Sheets:', error);
    throw error;
  }
}

// Delete an egg from the Google Sheet
export async function deleteEggFromSheets(rowIndex: number): Promise<void> {
  try {
    // Delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assumes the Eggs sheet is the first sheet (ID 0)
                dimension: 'ROWS',
                startIndex: rowIndex + 1, // +1 because row 0 is headers
                endIndex: rowIndex + 2
              }
            }
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error deleting egg from Google Sheets:', error);
    throw error;
  }
}

// Get statistics from Google Sheets data
export async function getEggStatsFromSheets() {
  const data = await readEggDataFromSheets();
  let totalEggs = 0;
  let totalWeight = 0;
  let speckledCount = 0;

  data.eggs.forEach((day) => {
    totalEggs += day.eggs.length;
    day.eggs.forEach((egg) => {
      totalWeight += egg.weight;
      if (egg.speckled) {
        speckledCount++;
      }
    });
  });

  const avgWeight = totalEggs > 0 ? totalWeight / totalEggs : 0;

  // Calculate eggs per day
  const eggsPerDay = data.eggs.map((day) => ({
    date: day.date,
    count: day.eggs.length,
  }));

  // Calculate weight distribution
  const weightRanges = {
    small: 0, // < 55g
    medium: 0, // 55-65g
    large: 0, // > 65g
  };

  data.eggs.forEach((day) => {
    day.eggs.forEach((egg) => {
      if (egg.weight < 55) weightRanges.small++;
      else if (egg.weight <= 65) weightRanges.medium++;
      else weightRanges.large++;
    });
  });

  return {
    totalEggs,
    avgWeight: avgWeight.toFixed(1),
    eggsPerDay,
    weightRanges,
    speckledCount,
    plainCount: totalEggs - speckledCount,
  };
}