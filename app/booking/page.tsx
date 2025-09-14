'use client'
import React, { useState } from 'react';

// Demo time slots and booking data
const TIME_SLOTS = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
];
const MAX_PER_SLOT = 3;

function getToday() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

function BookingPage() {

    type Booking = {
        date: string;
        slot: string;
        user: string;
        name: string;
    };

    const [date, setDate] = useState<string>(getToday());
    const [slot, setSlot] = useState<string>('');
    const [bookings, setBookings] = useState<Booking[]>([]); // {date, slot, user, name}
    const [myBookings, setMyBookings] = useState<Booking[]>([]); // user's bookings
    const [name, setName] = useState<string>('สมชาย');
    const [message, setMessage] = useState<string>('');

    // Simulate user id (in real app, get from auth)
    const userId = 'me';

    // Count bookings for a slot
    const countForSlot = (d: string, s: string) => bookings.filter((b) => b.date === d && b.slot === s).length;
    const isSlotFull = (d: string, s: string) => countForSlot(d, s) >= MAX_PER_SLOT;

    // Handle booking
    const handleBook = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!slot || !date || !name) {
            setMessage('กรุณาเลือกวันที่ เวลา และกรอกชื่อของคุณ');
            return;
        }
        if (isSlotFull(date, slot)) {
            setMessage('ช่วงเวลานี้เต็มแล้ว กรุณาเลือกช่วงเวลาอื่น');
            return;
        }
        // Prevent user from booking the same slot more than once
        const alreadyBooked = bookings.some(b => b.date === date && b.slot === slot && b.user === userId);
        if (alreadyBooked) {
            setMessage('คุณได้จองช่วงเวลานี้แล้ว');
            return;
        }
        const newBooking: Booking = { date, slot, user: userId, name };
        setBookings((prev) => [...prev, newBooking]);
        setMyBookings((prev) => [...prev, newBooking]);
        setMessage('จองสำเร็จ!');
    };

    // Show only future bookings for this user
    const upcoming = myBookings.filter((b) => {
        const now = new Date();
        const bDate = new Date(b.date + 'T00:00');
        return bDate >= new Date(now.toDateString());
    });

    // Cancel booking handler
    const handleCancel = (booking: Booking) => {
        setBookings(prev => prev.filter(b => !(b.date === booking.date && b.slot === booking.slot && b.user === booking.user && b.name === booking.name)));
        setMyBookings(prev => prev.filter(b => !(b.date === booking.date && b.slot === booking.slot && b.user === booking.user && b.name === booking.name)));
        setMessage('ยกเลิกการจองสำเร็จ');
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">จองคิวบริการฝ่ายบุคคล</h1>
            <form onSubmit={handleBook} className="space-y-4 bg-white p-4 rounded shadow">
                <div>
                    <label className="block mb-1 font-medium">ชื่อของคุณ</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">เลือกวันที่</label>
                    <input type="date" value={date} min={getToday()} onChange={e => setDate(e.target.value)} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">เลือกช่วงเวลา</label>
                    <select value={slot} onChange={e => setSlot(e.target.value)} className="border rounded px-2 py-1 w-full">
                        <option value="">-- เลือก --</option>
                        {TIME_SLOTS.map(ts => (
                            <option key={ts} value={ts} disabled={isSlotFull(date, ts)}>
                                {ts} {isSlotFull(date, ts) ? '(เต็ม)' : `(เหลือ ${MAX_PER_SLOT - countForSlot(date, ts)} ที่)`}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">จองคิว</button>
                {message && <div className="mt-2 text-sm text-green-700">{message}</div>}
            </form>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">การจองคิวของฉัน</h2>
                {upcoming.length === 0 ? (
                    <div className="text-gray-500">ยังไม่มีการจองคิว</div>
                ) : (
                    <ul className="space-y-2">
                        {upcoming.map((b, i) => (
                            <li key={i} className="border rounded p-2 bg-gray-50 flex items-center justify-between">
                                <div>
                                    <span className="font-medium">{b.date}</span> เวลา <span className="font-medium">{b.slot}</span> สำหรับ <span>{b.name}</span>
                                </div>
                                <button
                                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => handleCancel(b)}
                                    type="button"
                                >
                                    ยกเลิก
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default BookingPage;