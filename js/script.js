document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. CONFIGURATION (EDIT HOURS HERE)
       ========================================= */
    // Use 24-hour format (e.g., 17 = 5pm, 0 = Midnight, 2 = 2am)
    // 0 = Sunday, 1 = Monday, etc.
    const barHours = [
        { day: 0, open: 17, close: 2 },  // Sunday: 5pm - 2am
        { day: 1, open: null, close: null }, // Monday: Closed
        { day: 2, open: 17, close: 2 },  // Tuesday: 5pm - 2am
        { day: 3, open: 17, close: 2 },  // Wednesday
        { day: 4, open: 17, close: 2 },  // Thursday (Happy Hour!)
        { day: 5, open: 17, close: 2 },  // Friday
        { day: 6, open: 17, close: 2 }   // Saturday (Open early)
    ];

    /* =========================================
       2. STATUS LOGIC
       ========================================= */
    function updateStatus() {
        const now = new Date();
        const currentDay = now.getDay(); // 0-6
        const currentHour = now.getHours(); // 0-23
        
        const statusText = document.getElementById('status-text');
        const statusBox = document.getElementById('status-box');
        
        // Helper to format time (e.g., 17 -> "5 PM", 2 -> "2 AM")
        const formatTime = (h) => {
            if (h === 0) return "12 AM";
            if (h === 12) return "12 PM";
            return h > 12 ? (h - 12) + " PM" : h + " AM";
        };

        // BAR LOGIC: Handle "Yesterday's Shift" (e.g., It's 1AM Tuesday, but that's Monday night shift)
        // We check if the previous day had a closing time past midnight (0, 1, 2, 3...)
        const prevDayIndex = currentDay === 0 ? 6 : currentDay - 1;
        const prevDaySchedule = barHours[prevDayIndex];

        // Case A: It's early morning, are we still open from last night?
        if (prevDaySchedule.close !== null && prevDaySchedule.close < prevDaySchedule.open && currentHour < prevDaySchedule.close) {
            statusText.innerText = `OPEN UNTIL \n ${formatTime(prevDaySchedule.close)} :D`;
            statusBox.classList.remove('closed');
            return;
        }

        const todaySchedule = barHours[currentDay];

        // Case B: We are currently within today's opening hours
        // Logic: If close is small (e.g. 2am), we treat it as open if hour >= open
        //        If close is large (e.g. 23pm), we check range
        let isOpenNow = false;
        
        if (todaySchedule.open !== null) {
            if (todaySchedule.close < todaySchedule.open) {
                // Closes next morning (e.g. Open 17, Close 2)
                if (currentHour >= todaySchedule.open) isOpenNow = true;
            } else {
                // Closes same day (e.g. Open 12, Close 22)
                if (currentHour >= todaySchedule.open && currentHour < todaySchedule.close) isOpenNow = true;
            }
        }

        if (isOpenNow) {
            statusText.innerText = `OPEN UNTIL \n ${formatTime(todaySchedule.close)} :D`;
            statusBox.classList.remove('closed');
        } else {
            // Case C: We are closed. When do we open next?
            // This loop looks at today, then tomorrow, etc., until it finds an open time.
            let nextOpenDay = currentDay;
            let daysChecked = 0;
            let foundNext = false;

            while (!foundNext && daysChecked < 8) {
                const sched = barHours[nextOpenDay];
                
                // If looking at today, ensure open time is in future
                if (nextOpenDay === currentDay) {
                    if (sched.open !== null && currentHour < sched.open) {
                        statusText.innerText = `CLOSED :( \n OPENING AT ${formatTime(sched.open)}`;
                        foundNext = true;
                    }
                } else {
                    // Looking at future days
                    if (sched.open !== null) {
                        const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][nextOpenDay];
                        statusText.innerText = `CLOSED :( \n OPENING AT ${dayName} AT ${formatTime(sched.open)}`;
                        foundNext = true;
                    }
                }
                
                nextOpenDay = (nextOpenDay + 1) % 7; // Cycle 0-6
                daysChecked++;
            }
            
            statusBox.classList.add('closed');
        }
    }

    // Run immediately
    updateStatus();

    /* =========================================
       3. TOGGLE BUTTON (Existing Code)
       ========================================= */
    const accessBtn = document.getElementById('accessBtn');
    const marquee = document.getElementById('vibes-marquee');
    const body = document.body;

    accessBtn.addEventListener('click', () => {
        body.classList.toggle('access-mode');
        
        if (body.classList.contains('access-mode')) {
            if(marquee) marquee.stop(); 
            accessBtn.innerHTML = "🌑 FULL COLOR"; 
        } else {
            if(marquee) marquee.start();
            accessBtn.innerHTML = "🌕 HIGH CONTRAST"; 
        }
    });
});