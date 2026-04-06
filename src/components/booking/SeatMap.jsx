'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';

export default function SeatMap({ seats, onSeatSelect, selectedSeats, showtimes }) {
  const [selectedTime, setSelectedTime] = useState(showtimes?.[0]?._id || null);

  const rows = {};
  seats.forEach((seat) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  // Determine color scheme based on seat status/type
  const getSeatColor = (seat) => {
    if (selectedSeats.includes(seat.seatNumber))
      return 'bg-red-500 text-white shadow-lg shadow-red-700/40';
    if (seat.status === 'booked')
      return 'bg-gray-600/60 text-gray-400 cursor-not-allowed';
    return 'border border-red-400/50 hover:bg-red-600/40 text-red-300';
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return;

    // Limit seat selection to max 5
    if (!selectedSeats.includes(seat.seatNumber) && selectedSeats.length >= 5) {
      alert('You can select a maximum of 5 seats.');
      return;
    }

    onSeatSelect(seat.seatNumber);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center px-6 py-10">
      {/* Background gradient glows */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-black to-red-950/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-800/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-900/20 rounded-full blur-3xl opacity-40" />


      {/* Seat Selection Section */}
      <div className="z-10 text-center">
        <h1 className="text-3xl font-bold mb-10 tracking-wide">Select Your Seat</h1>

        {/* Screen Bar */}
        <div className="mx-auto mb-8">
          <div className="h-2 w-80 mx-auto bg-linear-to-r from-red-600 via-red-400 to-red-600 rounded-full"></div>
          <p className="text-xs text-gray-400 mt-2 tracking-widest">SCREEN SIDE</p>
        </div>

        {/* Seat Layout */}
        <div className="space-y-4">
          {Object.entries(rows).map(([rowLetter, rowSeats]) => (
            <div key={rowLetter} className="flex items-center justify-center gap-3">
              <span className="w-6 text-sm font-medium text-gray-400">{rowLetter}</span>
              <div className="flex gap-3">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status !== 'available'}
                    title={`${seat.seatNumber} - ${seat.type}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 ${getSeatColor(
                      seat
                    )}`}
                  >
                    {seat.column}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Seat Legend */}
        <div className="mt-10 flex flex-wrap gap-5 justify-center text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-red-400/50 rounded-lg" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-lg" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-600/60 rounded-lg" />
            <span>Booked</span>
          </div>
        </div>

        
      </div>
    </div>
  );
}
