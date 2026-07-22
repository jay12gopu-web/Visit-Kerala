document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dynamic Glassmorphism Navbar State Handler
    // ==========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 2. Mobile Hamburger Navigation Overlay Toggle
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        // Toggle Icon state between bars and X close marker
        const icon = mobileMenuBtn.querySelector('i');
        if(icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile drawer when clicking structural menu landing points
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // ==========================================
    // 3. Apple/Singapore-Style Interactive Itinerary Tabs
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active states from all buttons & views
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Set current target active indicators
            button.classList.add('active');
            const targetedTabId = button.getAttribute('data-tab');
            document.getElementById(targetedTabId).classList.add('active');
        });
    });

    // ==========================================
    // 4. Smooth Intersection Observer Scroll Reveal 
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate once for performance
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 5. High-Performance Animated Counters (Statistics)
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats');
    let countersStarted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            counter.innerText = '0';
            const target = +counter.getAttribute('data-target');
            const speed = target / 60; // Adjust value divisor to scale execution pace
            
            const updateCounter = () => {
                const currentVal = +counter.innerText;
                if(currentVal < target) {
                    counter.innerText = Math.ceil(currentVal + speed);
                    setTimeout(updateCounter, 25);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // Trigger calculation sequence only when stats wrap passes visible boundaries
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && !countersStarted) {
                runCounters();
                countersStarted = true;
            }
        });
    }, { threshold: 0.4 });

    if(statsSection) {
        statsObserver.observe(statsSection);
    }

    // Keep long vacation plans easy to navigate and orient within.
    const planSectionNav = document.querySelector('.plan-section-nav');

    if (planSectionNav) {
        const planSections = [
            ['overview', document.querySelector('.route-overview')?.closest('section')],
            ['day-by-day', document.querySelector('.plan-day-list')?.closest('section')],
            ['budget', document.querySelector('.trip-budget-section')],
            ['stays', document.querySelector('.stay-options-section')],
            ['brochure', document.querySelector('.brochure-band')]
        ].filter(([, section]) => section);
        const planNavLinks = [...planSectionNav.querySelectorAll('a')];

        planSections.forEach(([id, section]) => {
            section.id = id;
        });

        const setActivePlanSection = (id) => {
            planNavLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        let planNavTicking = false;
        const updatePlanSection = () => {
            const marker = window.scrollY + 190;
            let currentSection = planSections[0][0];

            planSections.forEach(([id, section]) => {
                if (section.offsetTop <= marker) currentSection = id;
            });

            setActivePlanSection(currentSection);
            planNavTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!planNavTicking) {
                window.requestAnimationFrame(updatePlanSection);
                planNavTicking = true;
            }
        }, { passive: true });

        planNavLinks.forEach(link => {
            link.addEventListener('click', () => setActivePlanSection(link.getAttribute('href').slice(1)));
        });

        updatePlanSection();
    }

    // Expandable day schedules keep the overview clean while making every stop actionable.
    const planScheduleData = {
        'plan-3-days.html': [
            {
                place: 'Fort Kochi and Mattancherry',
                time: '2:00 PM-9:00 PM',
                transfer: 'Airport 1.5-2 hr; Ernakulam 35-50 min',
                stay: 'Fort Kochi',
                meals: 'Dinner; add a cafe stop if arriving early',
                summary: 'Keep arrival day walkable and flexible. The heritage quarter is easiest to explore after checking in and leaving the luggage behind.',
                schedule: [['2:00 PM', 'Hotel check-in and a short rest.'], ['3:30 PM', 'Walk St. Francis Church, the old streets, and the Chinese fishing-net waterfront.'], ['5:30 PM', 'Continue to Mattancherry or pause for sunset by the harbour.'], ['7:00 PM', 'Attend a pre-booked Kathakali performance, then have a Kerala-style dinner.']],
                note: 'If arrival is after 4:00 PM, keep Mattancherry for another visit and prioritise the waterfront plus the cultural show.'
            },
            {
                place: 'Kochi to Alappuzha backwaters',
                time: '8:00 AM-9:00 PM',
                transfer: '1.5-2.5 hr by road, traffic dependent',
                stay: 'Overnight houseboat, Alappuzha',
                meals: 'Breakfast, houseboat lunch, tea and dinner',
                summary: 'Leave Kochi after breakfast so the road transfer does not eat into the cruise. Confirm the jetty and boarding time with the operator one day earlier.',
                schedule: [['8:00 AM', 'Breakfast, checkout and depart from Kochi.'], ['11:30 AM', 'Reach the boarding jetty and complete houseboat check-in.'], ['1:00 PM', 'Lunch while cruising canals, paddy fields and village stretches.'], ['4:00 PM', 'Tea, photos and a quieter backwater stretch before sunset.'], ['8:00 PM', 'Dinner on board and overnight in the houseboat.']],
                note: 'Boarding points and cruise routes vary by operator. Keep a small overnight bag ready because large luggage can be awkward inside some boats.'
            },
            {
                place: 'Alappuzha to Kochi',
                time: '7:00 AM onward',
                transfer: '1.5-2.5 hr to Kochi; add airport buffer',
                stay: 'Departure day; Kochi only if extending',
                meals: 'Houseboat breakfast and lunch in Kochi',
                summary: 'Use the morning cruise as the final slow experience, then return to Kochi with enough margin for traffic and departure formalities.',
                schedule: [['7:00 AM', 'Wake on the backwaters and have breakfast on board.'], ['9:00 AM', 'Disembark, collect luggage and meet the driver.'], ['11:30 AM', 'Reach Kochi for lunch, crafts or spice shopping if time permits.'], ['3:00 PM', 'Begin the airport or railway-station transfer based on departure time.']],
                note: 'For a flight, keep a generous road and airport buffer. Skip shopping when the departure window is tight.'
            }
        ],
        'plan-5-days.html': [
            {
                place: 'Fort Kochi and Mattancherry',
                time: '2:00 PM-9:00 PM',
                transfer: 'Airport 1.5-2 hr; Ernakulam 35-50 min',
                stay: 'Fort Kochi',
                meals: 'Dinner and an optional cafe stop',
                summary: 'A light first day leaves room for delays while still giving you a proper introduction to Kochi.',
                schedule: [['2:00 PM', 'Check in and rest after the journey.'], ['4:00 PM', 'Explore Fort Kochi lanes, St. Francis Church and the waterfront.'], ['6:00 PM', 'Watch sunset near the fishing nets or browse local galleries.'], ['7:30 PM', 'Choose Kathakali or a relaxed local dinner.']],
                note: 'Late arrival? Do only the waterfront and dinner, then start the Munnar drive early the next morning.'
            },
            {
                place: 'Kochi to Munnar',
                time: '7:30 AM-7:00 PM',
                transfer: '4-5.5 hr uphill with scenic stops',
                stay: 'Munnar',
                meals: 'Breakfast, road lunch and dinner',
                summary: 'Treat the drive as part of the experience. Waterfalls, spice stalls and viewpoints can make the transfer longer than the map suggests.',
                schedule: [['7:30 AM', 'Breakfast, checkout and start the hill drive.'], ['10:30 AM', 'Short waterfall or viewpoint stop when weather and parking allow.'], ['1:00 PM', 'Lunch en route, then continue into tea country.'], ['3:30 PM', 'Check in and rest.'], ['5:00 PM', 'Take a short tea-estate or town walk before dinner.']],
                note: 'Hill roads are winding. Carry water and motion-sickness medication if needed, and avoid stacking too many stops into the transfer.'
            },
            {
                place: 'Munnar to Thekkady and Periyar',
                time: '8:00 AM-7:30 PM',
                transfer: '3-4.5 hr through plantation roads',
                stay: 'Thekkady',
                meals: 'Breakfast, lunch and dinner',
                summary: 'Use the morning for one final Munnar view, then continue to Thekkady for spice country and a pre-booked nature experience.',
                schedule: [['8:00 AM', 'Breakfast and a short tea-country viewpoint stop.'], ['10:30 AM', 'Depart for Thekkady through cardamom and plantation landscapes.'], ['2:00 PM', 'Lunch and hotel check-in.'], ['4:00 PM', 'Guided spice-garden visit or another locally available activity.'], ['7:00 PM', 'Dinner and an early night before the backwater transfer.']],
                note: 'Periyar activities have separate reporting times and availability. Confirm the chosen activity before leaving Munnar.'
            },
            {
                place: 'Thekkady to Alappuzha',
                time: '7:00 AM-9:00 PM',
                transfer: '4-5.5 hr downhill to the backwaters',
                stay: 'Overnight houseboat, Alappuzha',
                meals: 'Breakfast, houseboat lunch, tea and dinner',
                summary: 'This is an early-start transfer day. Reaching the jetty around midday protects the best part of the houseboat cruise.',
                schedule: [['7:00 AM', 'Breakfast, checkout and depart Thekkady.'], ['11:30 AM', 'Reach Alappuzha and complete houseboat boarding.'], ['1:00 PM', 'Lunch as the boat enters quieter canals.'], ['4:30 PM', 'Tea and sunset cruise.'], ['8:00 PM', 'Dinner and overnight on the water.']],
                note: 'Confirm the exact jetty, boat contact and meal preferences in advance. Carry cash for small waterside purchases.'
            },
            {
                place: 'Alappuzha to Kochi',
                time: '7:00 AM onward',
                transfer: '1.5-2.5 hr plus departure buffer',
                stay: 'Departure day',
                meals: 'Houseboat breakfast; lunch in Kochi if time allows',
                summary: 'Enjoy the last morning cruise, then make the departure connection the priority. Add shopping only when the timing is genuinely comfortable.',
                schedule: [['7:00 AM', 'Breakfast and final backwater views.'], ['9:00 AM', 'Disembark and depart for Kochi.'], ['11:30 AM', 'Optional spice, craft or waterfront stop.'], ['2:00 PM', 'Continue to the airport or railway station.']],
                note: 'Keep at least one extra traffic buffer for Kochi, especially for airport departures or weekend travel.'
            }
        ],
        'plan-7-days.html': [
            {
                place: 'Fort Kochi, Mattancherry and central Kochi',
                time: '2 days',
                transfer: 'Airport 1.5-2 hr; local ferry, auto or cab',
                stay: '2 nights in Fort Kochi',
                meals: 'Daily breakfast; seafood and Kerala dinner options',
                summary: 'Two nights let you separate the heritage sights from food, galleries and cultural experiences instead of racing through everything after arrival.',
                schedule: [['Day 1, 2 PM', 'Check in, walk the Fort Kochi waterfront and watch sunset.'], ['Day 1, 7 PM', 'Kathakali performance followed by dinner.'], ['Day 2, 9 AM', 'Visit Mattancherry, the palace area, spice streets and nearby heritage lanes.'], ['Day 2, 2 PM', 'Choose museums, galleries, cafes or a ferry ride.'], ['Day 2, 6 PM', 'Slow waterfront evening and an early dinner.']],
                note: 'Many heritage stops are easier earlier in the day. Keep one indoor option ready for heat or rain.'
            },
            {
                place: 'Kochi to Munnar and the tea country',
                time: '2 days',
                transfer: '4-5.5 hr uphill on Day 3',
                stay: '2 nights in Munnar',
                meals: 'Daily breakfast, road lunch and local dinners',
                summary: 'Day 3 is the scenic transfer; Day 4 is the unhurried highland day for tea estates, viewpoints and short walks.',
                schedule: [['Day 3, 7:30 AM', 'Leave Kochi after breakfast with one or two scenic stops.'], ['Day 3, 2 PM', 'Check in at Munnar and take a short plantation or town walk.'], ['Day 4, 8 AM', 'Start the main viewpoint and tea-country circuit.'], ['Day 4, 1 PM', 'Lunch and a tea or plantation experience.'], ['Day 4, 5 PM', 'Return before mist or rain reduces visibility.']],
                note: 'Do not try to cover every viewpoint. Choose a compact route based on weather and the location of your hotel.'
            },
            {
                place: 'Munnar to Thekkady and Periyar',
                time: '8:00 AM-8:00 PM',
                transfer: '3-4.5 hr through plantation country',
                stay: 'Thekkady',
                meals: 'Breakfast, lunch and dinner',
                summary: 'Leave Munnar after breakfast and reserve the afternoon for one confirmed Periyar-area or spice experience.',
                schedule: [['8:00 AM', 'Breakfast, checkout and depart Munnar.'], ['12:30 PM', 'Reach Thekkady, have lunch and check in.'], ['3:00 PM', 'Join a booked nature activity or guided spice-garden visit.'], ['6:30 PM', 'Browse the local market or attend a cultural programme.'], ['8:00 PM', 'Dinner near the hotel.']],
                note: 'Choose one main afternoon activity. Reporting times, weather and availability should be checked directly with the operator.'
            },
            {
                place: 'Thekkady to Kumarakom or Alappuzha',
                time: '7:30 AM-9:00 PM',
                transfer: '3.5-5 hr depending on chosen backwater base',
                stay: 'Houseboat or Vembanad Lake resort',
                meals: 'Breakfast, lunch, tea and dinner',
                summary: 'Pick one backwater style: Alappuzha for the classic canal cruise, or Kumarakom for a quieter resort and lake experience.',
                schedule: [['7:30 AM', 'Breakfast, checkout and start the downhill drive.'], ['12:00 PM', 'Reach the selected jetty or lake resort and check in.'], ['1:00 PM', 'Lunch followed by a backwater cruise or resort downtime.'], ['4:30 PM', 'Village scenery, birding or sunset by the lake.'], ['8:00 PM', 'Dinner and overnight by the water.']],
                note: 'Choose the base before booking transport. The jetty, hotel and next-day coastal route should all match the same option.'
            },
            {
                place: 'Backwaters to Varkala or Kovalam',
                time: '7:00 AM onward',
                transfer: '3-5 hr to the coast; then onward to departure',
                stay: 'Departure day or add one beach night',
                meals: 'Breakfast and coastal lunch',
                summary: 'A coastal finish works best with a late Thiruvananthapuram departure or an extra beach night. Otherwise, use the morning for wellness near the backwaters.',
                schedule: [['7:00 AM', 'Breakfast and checkout from the backwater stay.'], ['9:00 AM', 'Depart for Varkala or Kovalam.'], ['1:00 PM', 'Coastal lunch and a relaxed cliff, beach or wellness stop.'], ['4:30 PM', 'Begin the transfer toward Thiruvananthapuram.'], ['Evening', 'Depart or check in for an added beach night.']],
                note: 'Do not force the beach stop before an early flight. For Kochi departures, skip the southern coast and travel north instead.'
            }
        ],
        'plan-10-days.html': [
            {
                place: 'Fort Kochi, Mattancherry and central Kochi',
                time: '2 days',
                transfer: 'Airport 1.5-2 hr; local ferry, auto or cab',
                stay: '2 nights in Fort Kochi',
                meals: 'Daily breakfast plus two local dinners',
                summary: 'Use Day 1 for arrival and the waterfront, then give Day 2 to Mattancherry, museums, galleries, food and performance.',
                schedule: [['Day 1, 2 PM', 'Check in and explore the Fort Kochi waterfront.'], ['Day 1, 7 PM', 'Kathakali and a relaxed dinner.'], ['Day 2, 9 AM', 'Mattancherry heritage area and spice streets.'], ['Day 2, 2 PM', 'Museums, galleries, ferry ride or cafe time.'], ['Day 2, 6 PM', 'Sunset and food-led evening.']],
                note: 'Keep Day 2 geographically compact so the long Kerala circuit begins without unnecessary fatigue.'
            },
            {
                place: 'Kochi to Alappuzha backwaters',
                time: '8:00 AM-9:00 PM',
                transfer: '1.5-2.5 hr by road',
                stay: 'Houseboat or Kumarakom lake resort',
                meals: 'Breakfast, lunch, tea and dinner',
                summary: 'Move to the backwaters after breakfast and keep the afternoon entirely for canals, paddy fields and village scenery.',
                schedule: [['8:00 AM', 'Checkout and depart Kochi.'], ['11:30 AM', 'Board the houseboat or check into the selected lake resort.'], ['1:00 PM', 'Lunch and backwater cruise.'], ['4:30 PM', 'Tea and sunset on the water.'], ['8:00 PM', 'Dinner and overnight.']],
                note: 'Confirm whether the next morning pickup is at the same jetty or hotel before the Munnar transfer is booked.'
            },
            {
                place: 'Alappuzha to Munnar and the high country',
                time: '2 days',
                transfer: '4.5-6 hr uphill on Day 4',
                stay: '2 nights in Munnar',
                meals: 'Daily breakfast, road lunch and dinners',
                summary: 'Day 4 is a long scenic transfer. Keep Day 5 for the main tea-country circuit, viewpoints and a plantation experience.',
                schedule: [['Day 4, 7:30 AM', 'Leave the backwaters after breakfast.'], ['Day 4, 1 PM', 'Lunch en route and continue into the hills.'], ['Day 4, 4 PM', 'Munnar check-in and a short evening walk.'], ['Day 5, 8 AM', 'Tea gardens, viewpoints and waterfall route.'], ['Day 5, 2 PM', 'Plantation experience, cafe stop and an early return.']],
                note: 'Select sights near the hotel rather than zig-zagging across Munnar. Weather can shorten the usable sightseeing window.'
            },
            {
                place: 'Munnar to Thekkady and Periyar',
                time: '8:00 AM-8:00 PM',
                transfer: '3-4.5 hr through plantation roads',
                stay: 'Thekkady',
                meals: 'Breakfast, lunch and dinner',
                summary: 'Travel through plantation country and reserve the afternoon for one confirmed spice, lake or guided nature activity.',
                schedule: [['8:00 AM', 'Breakfast, checkout and depart Munnar.'], ['12:30 PM', 'Arrive in Thekkady for lunch and check-in.'], ['3:00 PM', 'Join the chosen pre-booked activity.'], ['6:30 PM', 'Spice market, cooking experience or cultural show.'], ['8:00 PM', 'Dinner and prepare for the northbound journey.']],
                note: 'Confirm the next transfer before arrival. Thekkady to Wayanad is a major cross-state road day and needs an early start.'
            },
            {
                place: 'Thekkady to Wayanad',
                time: '2 days, including a major transfer',
                transfer: 'About 8-10 hr by road; break the trip if preferred',
                stay: '2 nights in Wayanad',
                meals: 'Daily breakfast, road lunch and dinners',
                summary: 'Day 7 is primarily a northbound transfer. Day 8 is the full Wayanad day for one compact forest, waterfall or heritage circuit.',
                schedule: [['Day 7, 6:30 AM', 'Early checkout and begin the long road transfer.'], ['Day 7, 12:30 PM', 'Planned lunch and rest stop on the route.'], ['Day 7, 5:30 PM', 'Reach Wayanad, check in and keep the evening quiet.'], ['Day 8, 8 AM', 'Start one weather-appropriate Wayanad sightseeing circuit.'], ['Day 8, 4 PM', 'Return to the stay before dark and prepare for the coast.']],
                note: 'For a gentler trip, add a transit night or use a rail/flight connection via Kochi or Kozhikode. Do not pair the long drive with major sightseeing.'
            },
            {
                place: 'Wayanad to Kozhikode, Kannur or Bekal',
                time: '2 days with one chosen finale',
                transfer: '2.5-7 hr depending on the selected coast',
                stay: 'Kozhikode, Kannur or Bekal',
                meals: 'Daily breakfast and a Malabar food experience',
                summary: 'Choose one finale based on the departure airport: Kozhikode for food, Kannur for culture and coast, or Bekal for the fort and a slower resort ending.',
                schedule: [['Day 9, 8 AM', 'Leave Wayanad after breakfast for the chosen coastal base.'], ['Day 9, 1 PM', 'Check in, have lunch and begin the local experience.'], ['Day 9, 5 PM', 'Beach, city food walk or sunset near Bekal Fort.'], ['Day 10, 8 AM', 'One final local stop followed by checkout.'], ['Day 10, Noon', 'Transfer to the airport or railway station with a generous buffer.']],
                note: 'Kozhikode suits CCJ departures, Kannur suits CNN, and Bekal often pairs best with Mangaluru. Confirm the final connection before hotels are booked.'
            }
        ]
    };

    const currentPlanFile = window.location.pathname.split('/').pop() || 'index.html';
    const currentPlanSchedule = planScheduleData[currentPlanFile];

    if (currentPlanSchedule) {
        const dayCards = [...document.querySelectorAll('.plan-day')];

        const setDayCardOpen = (card, isOpen) => {
            const toggle = card.querySelector('.plan-day-toggle');
            const panel = card.querySelector('.plan-day-details');
            const title = card.querySelector('.plan-day-copy h2')?.textContent.trim() || 'this day';

            if (!toggle || !panel) return;

            card.classList.toggle('is-expanded', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', `${isOpen ? 'Hide' : 'Show'} full schedule for ${title}`);
            toggle.title = `${isOpen ? 'Hide' : 'Show'} full schedule`;
            panel.hidden = !isOpen;
        };

        dayCards.forEach((card, index) => {
            const details = currentPlanSchedule[index];
            const label = card.querySelector('.plan-day-label');
            const cardTitle = card.querySelector('.plan-day-copy h2')?.textContent.trim();

            if (!details || !label || !cardTitle) return;

            const panelId = `plan-day-details-${index + 1}`;
            const headingId = `${panelId}-heading`;
            const toggle = document.createElement('button');
            toggle.className = 'plan-day-toggle';
            toggle.type = 'button';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', panelId);
            toggle.setAttribute('aria-label', `Show full schedule for ${cardTitle}`);
            toggle.title = 'Show full schedule';
            toggle.innerHTML = '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
            label.append(toggle);

            const panel = document.createElement('section');
            panel.className = 'plan-day-details';
            panel.id = panelId;
            panel.hidden = true;
            panel.setAttribute('aria-labelledby', headingId);

            const header = document.createElement('div');
            header.className = 'plan-day-details-header';
            const eyebrow = document.createElement('span');
            eyebrow.className = 'plan-day-details-eyebrow';
            eyebrow.textContent = 'Full Schedule';
            const heading = document.createElement('h3');
            heading.id = headingId;
            heading.textContent = `Plan your time: ${cardTitle}`;
            const summary = document.createElement('p');
            summary.textContent = details.summary;
            header.append(eyebrow, heading, summary);

            const facts = document.createElement('div');
            facts.className = 'plan-day-facts';
            const factItems = [
                ['fa-location-dot', 'Places', details.place],
                ['fa-clock', 'Suggested time', details.time],
                ['fa-car-side', 'Transfer', details.transfer],
                ['fa-bed', 'Overnight', details.stay],
                ['fa-utensils', 'Meals', details.meals]
            ];

            factItems.forEach(([iconName, factLabel, value]) => {
                const fact = document.createElement('div');
                const icon = document.createElement('i');
                const copy = document.createElement('div');
                const labelText = document.createElement('span');
                const valueText = document.createElement('strong');

                icon.className = `fa-solid ${iconName}`;
                icon.setAttribute('aria-hidden', 'true');
                labelText.textContent = factLabel;
                valueText.textContent = value;
                copy.append(labelText, valueText);
                fact.append(icon, copy);
                facts.append(fact);
            });

            const expandedBody = document.createElement('div');
            expandedBody.className = 'plan-day-details-body';
            const timeline = document.createElement('div');
            timeline.className = 'plan-day-timeline';
            const timelineHeading = document.createElement('h4');
            timelineHeading.textContent = 'Suggested Flow';
            const timelineList = document.createElement('ol');

            details.schedule.forEach(([time, activity]) => {
                const item = document.createElement('li');
                const timeText = document.createElement('time');
                const activityText = document.createElement('p');
                timeText.textContent = time;
                activityText.textContent = activity;
                item.append(timeText, activityText);
                timelineList.append(item);
            });

            timeline.append(timelineHeading, timelineList);

            const note = document.createElement('aside');
            note.className = 'plan-day-note';
            const noteIcon = document.createElement('i');
            const noteCopy = document.createElement('div');
            const noteHeading = document.createElement('h4');
            const noteText = document.createElement('p');
            noteIcon.className = 'fa-regular fa-lightbulb';
            noteIcon.setAttribute('aria-hidden', 'true');
            noteHeading.textContent = 'Plan It Better';
            noteText.textContent = details.note;
            noteCopy.append(noteHeading, noteText);
            note.append(noteIcon, noteCopy);

            expandedBody.append(timeline, note);
            panel.append(header, facts, expandedBody);
            card.append(panel);

            toggle.addEventListener('click', () => {
                const willOpen = toggle.getAttribute('aria-expanded') !== 'true';

                if (willOpen) {
                    dayCards.forEach(otherCard => {
                        if (otherCard !== card) setDayCardOpen(otherCard, false);
                    });
                }

                setDayCardOpen(card, willOpen);
            });
        });
    }

    // Indicative room bands make hotel options comparable without presenting them as live quotes.
    const hotelPriceBands = {
        'Forte Kochi': 'INR 11,000-18,000',
        'Punnamada Resort': 'INR 8,000-14,000',
        'KTDC Waterscapes': 'INR 6,000-10,000',
        'Coconut Lagoon': 'INR 18,000-30,000',
        'KTDC Tea County': 'INR 6,000-10,000',
        'KTDC Aranya Nivas': 'INR 5,500-9,000',
        'Spice Village': 'INR 16,000-26,000',
        'Gateway Varkala': 'INR 10,000-18,000',
        'Wayanad Wild': 'INR 16,000-25,000',
        'Taj Bekal Resort & Spa': 'INR 22,000-38,000'
    };

    document.querySelectorAll('.stay-option-card').forEach(card => {
        const hotelName = card.querySelector('h3');
        const priceBand = hotelPriceBands[hotelName?.textContent.trim()];

        if (!hotelName || !priceBand) return;

        const price = document.createElement('div');
        const amount = document.createElement('strong');
        const unit = document.createElement('span');

        price.className = 'stay-price';
        price.title = 'Indicative planning range. Check the hotel for current rates.';
        amount.textContent = priceBand;
        unit.textContent = 'typical room / night';
        price.append(amount, unit);
        hotelName.insertAdjacentElement('afterend', price);
    });

    document.querySelectorAll('.stay-booking-note p').forEach(note => {
        note.prepend('Prices shown are indicative nightly planning bands. ');
    });

    // Profile preferences stay on the visitor's device.
    const profileForm = document.getElementById('profile-form');

    if (profileForm) {
        const profileStorageKey = 'visitKeralaProfile';
        const profileNameInput = document.getElementById('profile-name');
        const profileEmailInput = document.getElementById('profile-email');
        const profileCityInput = document.getElementById('profile-city');
        const profilePaceInput = document.getElementById('profile-pace');
        const profileStatus = document.getElementById('profile-status');
        const profileReset = document.getElementById('profile-reset');
        const interestInputs = [...document.querySelectorAll('input[name="interests"]')];

        const updateProfileIdentity = (name) => {
            const displayName = name.trim() || 'Guest Traveller';
            const initials = displayName.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();

            document.querySelectorAll('[data-profile-name]').forEach(element => {
                element.textContent = displayName;
            });

            document.querySelectorAll('[data-profile-initials]').forEach(element => {
                element.textContent = initials;
            });
        };

        const getProfile = () => {
            try {
                return JSON.parse(localStorage.getItem(profileStorageKey)) || {};
            } catch {
                return {};
            }
        };

        const storedProfile = getProfile();
        profileNameInput.value = storedProfile.name || profileNameInput.value;
        profileEmailInput.value = storedProfile.email || '';
        profileCityInput.value = storedProfile.city || '';
        profilePaceInput.value = storedProfile.pace || profilePaceInput.value;
        interestInputs.forEach(input => {
            input.checked = storedProfile.interests ? storedProfile.interests.includes(input.value) : input.checked;
        });
        updateProfileIdentity(profileNameInput.value);

        profileForm.addEventListener('submit', event => {
            event.preventDefault();
            const profile = {
                name: profileNameInput.value.trim() || 'Guest Traveller',
                email: profileEmailInput.value.trim(),
                city: profileCityInput.value.trim(),
                pace: profilePaceInput.value,
                interests: interestInputs.filter(input => input.checked).map(input => input.value)
            };

            localStorage.setItem(profileStorageKey, JSON.stringify(profile));
            updateProfileIdentity(profile.name);
            profileStatus.textContent = 'Profile saved on this device.';
        });

        profileReset.addEventListener('click', () => {
            localStorage.removeItem(profileStorageKey);
            profileForm.reset();
            updateProfileIdentity(profileNameInput.value);
            profileStatus.textContent = 'Profile reset.';
        });
    }

    // ==========================================
    // 7. Floating Kerala Travel Assistant
    // ==========================================
    const assistantWidget = document.createElement('aside');
    assistantWidget.className = 'assistant-widget';
    assistantWidget.setAttribute('aria-label', 'Kerala travel assistant');
    assistantWidget.innerHTML = `
        <section class="assistant-panel" id="kerala-assistant-panel" aria-label="Kerala travel assistant" aria-live="polite">
            <header class="assistant-header"><div class="assistant-heading"><i class="fa-solid fa-wand-magic-sparkles"></i><div><strong>Kerala Travel Assistant</strong><span>Destinations, routes, and trip ideas</span></div></div><button class="assistant-close" type="button" title="Close assistant" aria-label="Close assistant"><i class="fa-solid fa-xmark"></i></button></header>
            <div class="assistant-messages" id="assistant-messages"><div class="assistant-message bot"><p>Hi. Ask me about Kerala destinations, houseboats, the best trip length, weather, or route ideas.</p></div></div>
            <div class="assistant-composer"><div class="assistant-suggestions"><button class="assistant-suggestion" type="button" data-prompt="Which Kerala trip is best for 5 days?">5-day trip</button><button class="assistant-suggestion" type="button" data-prompt="Tell me about Munnar">Munnar</button><button class="assistant-suggestion" type="button" data-prompt="What are Kerala backwaters?">Backwaters</button></div><form class="assistant-form"><input id="assistant-input" type="text" placeholder="Ask about Kerala..." autocomplete="off" aria-label="Ask a Kerala travel question"><button class="assistant-send" type="submit" title="Send question" aria-label="Send question"><i class="fa-solid fa-arrow-up"></i></button></form></div>
        </section>
        <button class="assistant-toggle" id="kerala-assistant-toggle" type="button" title="Ask Kerala Travel Assistant" aria-label="Open Kerala Travel Assistant" aria-expanded="false"><i class="fa-solid fa-wand-magic-sparkles"></i></button>`;
    document.body.append(assistantWidget);

    const assistantPanel = document.getElementById('kerala-assistant-panel');
    const assistantToggle = document.getElementById('kerala-assistant-toggle');
    const assistantClose = assistantWidget.querySelector('.assistant-close');
    const assistantMessages = document.getElementById('assistant-messages');
    const assistantForm = assistantWidget.querySelector('.assistant-form');
    const assistantInput = document.getElementById('assistant-input');

    const assistantReplies = [
        { terms: ['3 day', 'three day', 'short trip', 'weekend'], text: "For a quick Kerala break, choose the 3-day Kochi and Alappuzha plan. It combines Fort Kochi, Mattancherry, and an overnight houseboat cruise.", link: ['plan-3-days.html', 'Open the 3-day plan'] },
        { terms: ['5 day', 'five day'], text: "The 5-day route is the best first-time balance: Kochi, Munnar tea country, Thekkady spice landscapes, then Alappuzha backwaters.", link: ['plan-5-days.html', 'Open the 5-day plan'] },
        { terms: ['7 day', 'seven day', 'one week', 'best trip'], text: "The 7-day Classic Kerala plan gives you the fullest first visit: Kochi, Munnar, Thekkady, backwaters, and a beach or wellness finish.", link: ['plan-7-days.html', 'Open the 7-day plan'] },
        { terms: ['10 day', 'ten day', 'deep dive', 'north kerala'], text: "For a deeper route, take 10 days and add Wayanad plus Kozhikode, Kannur, or Bekal to the southern Kerala classics.", link: ['plan-10-days.html', 'Open the 10-day plan'] },
        { terms: ['munnar', 'tea', 'hill'], text: "Munnar is Kerala's cool highland escape. Go for tea estates, viewpoint drives, waterfalls, and plantation stays; give it at least two nights for an unhurried feel.", link: ['destination-munnar.html', 'Explore Munnar'] },
        { terms: ['alappuzha', 'alleppey', 'backwater', 'houseboat'], text: "Alappuzha is the classic backwater base. A houseboat is best for a sunset-to-breakfast cruise through canals, paddy fields, and village scenery.", link: ['destination-alappuzha.html', 'Explore Alappuzha'] },
        { terms: ['wayanad', 'wildlife', 'forest', 'thekkady', 'periyar'], text: "For forests and nature, choose Thekkady for spice gardens and Periyar-area experiences, or Wayanad for waterfalls, plantations, caves, and slower highland stays.", link: ['destination-wayanad.html', 'Explore Wayanad'] },
        { terms: ['beach', 'varkala', 'kovalam'], text: "Varkala and Kovalam work well as a relaxed coastal finish. Add them to the 7-day route after your backwater stay, or keep the final day flexible for wellness.", link: ['plan-7-days.html', 'See the 7-day route'] },
        { terms: ['weather', 'best time', 'when', 'season', 'monsoon'], text: "Kerala changes beautifully through the year. For planning specifics, check the current season, weather, opening times, and travel notes in the official planning resources before booking.", link: ['travel-info.html', 'Open travel info'] },
        { terms: ['airport', 'train', 'transport', 'travel', 'reach', 'getting'], text: "Kochi is a convenient start for the classic south Kerala circuit. Build your arrival and departure around the first and last stops, and allow relaxed transfer time for the hill routes.", link: ['travel-info.html', 'Open travel info'] },
        { terms: ['food', 'culture', 'ayurveda', 'kathakali', 'festival'], text: "Kerala's journey is as much about culture as scenery. Fort Kochi is great for heritage and Kathakali, while a coastal or backwater finish is a good place to add an Ayurveda session.", link: ['experiences.html', 'Explore experiences'] }
    ];

    const addAssistantMessage = (kind, text, link) => {
        const message = document.createElement('div');
        message.className = `assistant-message ${kind}`;
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        message.append(paragraph);

        if (link) {
            const anchor = document.createElement('a');
            anchor.href = link[0];
            anchor.textContent = link[1];
            message.append(anchor);
        }

        assistantMessages.append(message);
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    };

    const getAssistantReply = (question) => {
        const normalizedQuestion = question.toLowerCase();
        const matchingReply = assistantReplies.find(reply => reply.terms.some(term => normalizedQuestion.includes(term)));
        return matchingReply || { text: "I can help with Kerala places, vacation lengths, hill stations, beaches, backwaters, wildlife, culture, and travel planning. Try asking about Munnar, houseboats, or which plan fits your days.", link: ['travel-info.html', 'Open travel info'] };
    };

    const askAssistant = (question) => {
        const cleanQuestion = question.trim();
        if (!cleanQuestion) return;

        addAssistantMessage('user', cleanQuestion);
        assistantInput.value = '';
        const typing = document.createElement('div');
        typing.className = 'assistant-message bot typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        assistantMessages.append(typing);
        assistantMessages.scrollTop = assistantMessages.scrollHeight;

        window.setTimeout(() => {
            typing.remove();
            const reply = getAssistantReply(cleanQuestion);
            addAssistantMessage('bot', reply.text, reply.link);
        }, 360);
    };

    assistantToggle.addEventListener('click', () => {
        const isOpen = assistantPanel.classList.toggle('is-open');
        assistantToggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) assistantInput.focus();
    });

    assistantClose.addEventListener('click', () => {
        assistantPanel.classList.remove('is-open');
        assistantToggle.setAttribute('aria-expanded', 'false');
        assistantToggle.focus();
    });

    assistantForm.addEventListener('submit', event => {
        event.preventDefault();
        askAssistant(assistantInput.value);
    });

    assistantWidget.querySelectorAll('.assistant-suggestion').forEach(button => {
        button.addEventListener('click', () => askAssistant(button.dataset.prompt));
    });
});
