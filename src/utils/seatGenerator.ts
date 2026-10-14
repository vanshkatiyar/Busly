import { BusSeat } from '../types';

export function generateBusSeats(basePrice: number): { lowerDeck: BusSeat[]; upperDeck: BusSeat[] } {
  const lowerDeck: BusSeat[] = [];
  const upperDeck: BusSeat[] = [];

  // Deterministic seed simulation based on basePrice
  const bookedSeatIndicesLower = [1, 4, 7, 10, 14, 15];
  const ladiesSeatIndicesLower = [3, 8];

  const bookedSeatIndicesUpper = [2, 5, 8, 11, 13];
  const ladiesSeatIndicesUpper = [0, 6];

  // Lower Deck: 5 rows
  // Left: Single Sleeper (or window seat), Right: Double Sleeper
  for (let row = 0; row < 5; row++) {
    // Left Berth/Seat
    const seatIdL = `L${row + 1}`;
    const isBookedL = bookedSeatIndicesLower.includes(row * 3);
    const isLadiesL = ladiesSeatIndicesLower.includes(row * 3);

    lowerDeck.push({
      id: `seat-lower-${seatIdL}`,
      number: `L${row + 1}`,
      deck: 'lower',
      type: 'sleeper',
      price: basePrice,
      status: isLadiesL ? 'ladies' : isBookedL ? 'booked' : 'available',
      row,
      col: 0,
    });

    // Right Double Berth 1
    const seatIdR1 = `R${row * 2 + 1}`;
    const isBookedR1 = bookedSeatIndicesLower.includes(row * 3 + 1);
    const isLadiesR1 = ladiesSeatIndicesLower.includes(row * 3 + 1);

    lowerDeck.push({
      id: `seat-lower-${seatIdR1}`,
      number: `R${row * 2 + 1}`,
      deck: 'lower',
      type: 'sleeper',
      price: basePrice,
      status: isLadiesR1 ? 'ladies' : isBookedR1 ? 'booked' : 'available',
      row,
      col: 2,
    });

    // Right Double Berth 2
    const seatIdR2 = `R${row * 2 + 2}`;
    const isBookedR2 = bookedSeatIndicesLower.includes(row * 3 + 2);
    const isLadiesR2 = ladiesSeatIndicesLower.includes(row * 3 + 2);

    lowerDeck.push({
      id: `seat-lower-${seatIdR2}`,
      number: `R${row * 2 + 2}`,
      deck: 'lower',
      type: 'sleeper',
      price: basePrice,
      status: isLadiesR2 ? 'ladies' : isBookedR2 ? 'booked' : 'available',
      row,
      col: 3,
    });
  }

  // Upper Deck: 5 rows
  for (let row = 0; row < 5; row++) {
    const seatIdLU = `U${row + 1}`;
    const isBookedLU = bookedSeatIndicesUpper.includes(row * 3);
    const isLadiesLU = ladiesSeatIndicesUpper.includes(row * 3);

    upperDeck.push({
      id: `seat-upper-${seatIdLU}`,
      number: `U${row + 1}`,
      deck: 'upper',
      type: 'sleeper',
      price: basePrice + 100, // Upper deck premium or variance
      status: isLadiesLU ? 'ladies' : isBookedLU ? 'booked' : 'available',
      row,
      col: 0,
    });

    const seatIdRU1 = `UR${row * 2 + 1}`;
    const isBookedRU1 = bookedSeatIndicesUpper.includes(row * 3 + 1);
    const isLadiesRU1 = ladiesSeatIndicesUpper.includes(row * 3 + 1);

    upperDeck.push({
      id: `seat-upper-${seatIdRU1}`,
      number: `UR${row * 2 + 1}`,
      deck: 'upper',
      type: 'sleeper',
      price: basePrice + 100,
      status: isLadiesRU1 ? 'ladies' : isBookedRU1 ? 'booked' : 'available',
      row,
      col: 2,
    });

    const seatIdRU2 = `UR${row * 2 + 2}`;
    const isBookedRU2 = bookedSeatIndicesUpper.includes(row * 3 + 2);
    const isLadiesRU2 = ladiesSeatIndicesUpper.includes(row * 3 + 2);

    upperDeck.push({
      id: `seat-upper-${seatIdRU2}`,
      number: `UR${row * 2 + 2}`,
      deck: 'upper',
      type: 'sleeper',
      price: basePrice + 100,
      status: isLadiesRU2 ? 'ladies' : isBookedRU2 ? 'booked' : 'available',
      row,
      col: 3,
    });
  }

  return { lowerDeck, upperDeck };
}
