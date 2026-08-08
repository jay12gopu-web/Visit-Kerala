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

    // Keep the compact More area discoverable across the static pages without
    // duplicating a separate navigation layout on every destination guide.
    if (navLinks && !navLinks.querySelector('a[href="more.html"]')) {
        const moreItem = document.createElement('li');
        const moreLink = document.createElement('a');
        moreLink.href = 'more.html';
        moreLink.textContent = 'More';
        if (window.location.pathname.endsWith('/more.html')) {
            moreLink.classList.add('active');
            moreLink.setAttribute('aria-current', 'page');
        }
        moreItem.append(moreLink);
        navLinks.append(moreItem);
    }

    if (mobileMenuBtn && navLinks) {
        const closeMobileMenu = () => {
            navLinks.classList.remove('mobile-active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-label', 'Open navigation');
            document.body.classList.remove('nav-open');
            const icon = mobileMenuBtn.querySelector('i');
            icon?.classList.remove('fa-xmark');
            icon?.classList.add('fa-bars');
        };

        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('mobile-active');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
            document.body.classList.toggle('nav-open', isOpen);
            const icon = mobileMenuBtn.querySelector('i');
            icon?.classList.toggle('fa-bars', !isOpen);
            icon?.classList.toggle('fa-xmark', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1180) closeMobileMenu();
        });
    }

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
            ['transport', document.querySelector('.plan-transport-section')],
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

    // Every current itinerary starts in Kochi; these mode-level picks avoid pretending
    // that one operator or fare is best for every departure city and travel date.
    const transportSection = document.querySelector('.plan-transport-section');

    if (transportSection) {
        const transportRecommendations = [
            {
                mode: 'Flight',
                label: 'Best for long distance',
                icon: 'fa-plane-departure',
                score: '8.8',
                title: 'Direct economy flight from your city to Kochi',
                summary: 'Choose the shortest practical nonstop service to Kochi. A slightly higher direct fare often beats a cheaper connection once waiting time and fatigue are included.',
                time: '05:00-13:00',
                price: 'INR 3k-9k',
                comfort: 'High',
                distance: 'Best beyond 700 km',
                arrival: 'Kochi',
                href: 'https://www.cial.aero/',
                action: 'Check CIAL flights'
            },
            {
                mode: 'Train',
                label: 'Best overall value',
                icon: 'fa-train',
                score: '9.1',
                title: 'Direct AC train from your city to Kochi',
                summary: 'An overnight AC 2-tier or 3-tier service to Kochi balances fare and comfort. Confirm the station printed on your ticket before arranging pickup to the itinerary start.',
                time: '18:00-08:00 +1 day',
                price: 'INR 400-3k',
                comfort: 'Medium-high',
                distance: 'Best for 300-2,000 km',
                arrival: 'Kochi',
                href: 'https://www.irctc.co.in/nget/train-search',
                action: 'Search official trains'
            },
            {
                mode: 'Bus',
                label: 'Best nearby option',
                icon: 'fa-bus-simple',
                score: '8.3',
                title: 'Reserved AC coach from your city to Kochi',
                summary: 'Choose a direct AC sleeper or multi-axle coach to Kochi from a reputable operator. It works best from nearby South Indian cities, not for multi-day road journeys.',
                time: '20:00-08:00 +1 day',
                price: 'INR 700-2.5k',
                comfort: 'Medium',
                distance: 'Best under 700 km',
                arrival: 'Kochi',
                href: 'https://onlineksrtcswift.com/',
                action: 'Check KSRTC-SWIFT'
            }
        ];
        const additionalTransportOptions = [
            {
                mode: 'Flight choices',
                icon: 'fa-plane',
                intro: 'Choose by arrival timing, connection count and the real door-to-door journey.',
                options: [
                    { title: 'Early nonstop to Kochi', score: '9.0', time: '05:00-10:00', price: 'INR 3.5k-10k', fit: 'Same-day start', note: 'Useful when the flight lands early enough for a relaxed airport transfer and hotel check-in.' },
                    { title: 'Evening nonstop to Kochi', score: '8.8', time: '17:00-22:00', price: 'INR 3k-9k', fit: 'Rest before Day 1', note: 'A calm choice when you prefer to sleep in Kochi and begin the itinerary the next morning.' },
                    { title: 'One-stop fare saver', score: '7.5', time: '06:00-15:00', price: 'INR 2.8k-8k', fit: 'Flexible dates', note: 'Consider only when the saving is meaningful and the connection leaves a comfortable delay buffer.' }
                ]
            },
            {
                mode: 'Train choices',
                icon: 'fa-train-subway',
                intro: 'Compare class, overnight comfort and how conveniently the service reaches Kochi.',
                options: [
                    { title: 'AC 2-tier overnight', score: '9.3', time: '18:00-08:00 +1 day', price: 'INR 1.2k-3.5k', fit: 'Comfort pick', note: 'More personal space and fewer berths per bay make this the strongest long-rail comfort option.' },
                    { title: 'AC 3-tier overnight', score: '8.9', time: '19:00-10:00 +1 day', price: 'INR 700-2.2k', fit: 'Value pick', note: 'A practical balance for families and groups when berths on a direct overnight train are available.' },
                    { title: 'Day train or chair car', score: '8.0', time: '06:00-15:00', price: 'INR 400-1.5k', fit: 'Shorter rail routes', note: 'Works best from nearer cities when a daytime arrival is more useful than saving a hotel night.' }
                ]
            },
            {
                mode: 'Bus choices',
                icon: 'fa-bus',
                intro: 'Reserve a direct service to Kochi and confirm the drop point before arranging pickup.',
                options: [
                    { title: 'AC sleeper coach', score: '8.5', time: '19:00-07:00 +1 day', price: 'INR 1.1k-2.5k', fit: 'Overnight nearby', note: 'The most comfortable road option from nearby South Indian cities when a direct berth is available.' },
                    { title: 'Multi-axle AC seater', score: '8.2', time: '06:00-16:00', price: 'INR 800-2k', fit: 'Day or evening', note: 'A stable choice for travellers who prefer a reclining seat and do not need an overnight berth.' },
                    { title: 'Government reserved service', score: '8.0', time: '07:00-18:00', price: 'INR 700-1.8k', fit: 'Official value option', note: 'Compare KSRTC-SWIFT boarding points, coach type and arrival time on the official portal.' }
                ]
            }
        ];
        const audienceGuidance = {
            family: 'For families, a direct flight or overnight AC train usually gives the cleanest start. Reserve adjacent seats and leave arrival day flexible.',
            student: 'For student groups, compare direct train availability first; an AC coach can be the value pick from nearby South Indian cities.',
            senior: 'For senior travellers, prioritise a nonstop flight or AC 2-tier train, request assistance where needed, and avoid a tight same-day connection.'
        };
        const transportGrid = transportSection.querySelector('[data-transport-options]');
        const transportMorePanel = transportSection.querySelector('[data-transport-more-options]');
        const transportToggle = transportSection.querySelector('[data-transport-toggle]');
        const guidance = transportSection.querySelector('[data-transport-guidance]');
        const audience = transportSection.dataset.transportAudience || 'family';

        if (guidance) guidance.textContent = audienceGuidance[audience] || audienceGuidance.family;

        if (transportGrid) {
            transportGrid.innerHTML = transportRecommendations.map(option => `
                <article class="transport-option-card">
                    <div class="transport-card-topline">
                        <span class="transport-mode-icon" aria-hidden="true"><i class="fa-solid ${option.icon}"></i></span>
                        <span class="transport-pick-label">${option.label}</span>
                    </div>
                    <div class="transport-title-row">
                        <div><span class="transport-mode">${option.mode}</span><h3>${option.title}</h3></div>
                        <div class="transport-score" aria-label="${option.score} out of 10 planning score"><strong>${option.score}</strong><span>/10</span></div>
                    </div>
                    <p>${option.summary}</p>
                    <div class="transport-time-row"><i class="fa-regular fa-clock" aria-hidden="true"></i><span>Sample window</span><strong>${option.time}</strong></div>
                    <dl class="transport-metrics">
                        <div><dt>Typical fare*</dt><dd>${option.price}</dd></div>
                        <div><dt>Comfort</dt><dd>${option.comfort}</dd></div>
                        <div><dt>Journey fit</dt><dd>${option.distance}</dd></div>
                        <div><dt>Arrival</dt><dd>${option.arrival}</dd></div>
                    </dl>
                    <a href="${option.href}" target="_blank" rel="noopener">${option.action} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
                </article>
            `).join('');

            if (window.FontAwesome?.dom?.i2svg) window.FontAwesome.dom.i2svg();
        }

        if (transportMorePanel && transportToggle) {
            transportMorePanel.innerHTML = additionalTransportOptions.map(group => `
                <section class="transport-more-group">
                    <div class="transport-more-heading">
                        <span aria-hidden="true"><i class="fa-solid ${group.icon}"></i></span>
                        <div><h3>${group.mode}</h3><p>${group.intro}</p></div>
                    </div>
                    <div class="transport-variant-grid">
                        ${group.options.map(option => `
                            <article class="transport-variant-card">
                                <div class="transport-variant-title"><h4>${option.title}</h4><span aria-label="${option.score} out of 10 planning score">${option.score}</span></div>
                                <p>${option.note}</p>
                                <div class="transport-variant-time"><i class="fa-regular fa-clock" aria-hidden="true"></i><span>Sample window</span><strong>${option.time}</strong></div>
                                <dl><div><dt>Typical fare*</dt><dd>${option.price}</dd></div><div><dt>Best fit</dt><dd>${option.fit}</dd></div></dl>
                            </article>
                        `).join('')}
                    </div>
                </section>
            `).join('');

            transportToggle.hidden = false;
            transportToggle.addEventListener('click', () => {
                const shouldExpand = transportToggle.getAttribute('aria-expanded') !== 'true';
                transportToggle.setAttribute('aria-expanded', String(shouldExpand));
                transportMorePanel.hidden = !shouldExpand;
                transportToggle.querySelector('span').textContent = shouldExpand ? 'Hide additional options' : 'Explore more transport options';
                transportToggle.classList.toggle('expanded', shouldExpand);
            });
        }
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
        'plan-5-days-students.html': [
            {
                place: 'Kochi and Fort Kochi',
                time: '1:00 PM-9:30 PM',
                transfer: 'Airport 1.5-2 hr; use ferry or group cab locally',
                stay: 'Kochi or Ernakulam',
                meals: 'Budget lunch, cafe stop and local dinner',
                summary: 'Start with a flexible afternoon that gives the group time to arrive, check in and explore without committing to an expensive full-day vehicle.',
                schedule: [['1:00 PM', 'Meet at the stay, check in and secure luggage.'], ['3:00 PM', 'Use ferry or a shared cab for Fort Kochi.'], ['4:00 PM', 'Walk the waterfront, St. Francis Church and nearby heritage streets.'], ['6:30 PM', 'Choose sunset, a cultural performance or cafe time.'], ['8:00 PM', 'Group dinner and return to the stay.']],
                note: 'Agree on one meeting point and one group leader before splitting up. Keep hostel curfews and last-ferry timings in mind.'
            },
            {
                place: 'Kochi to Munnar',
                time: '7:00 AM-7:30 PM',
                transfer: '4-5.5 hr by shared cab or group vehicle',
                stay: 'Munnar or Chinnakanal',
                meals: 'Breakfast, road lunch and dinner',
                summary: 'Make the hill transfer part of the trip, but limit roadside stops so the group reaches Munnar before evening weather reduces visibility.',
                schedule: [['7:00 AM', 'Breakfast, checkout and load the group vehicle.'], ['10:00 AM', 'One waterfall or viewpoint stop based on parking and weather.'], ['12:30 PM', 'Affordable lunch on the road.'], ['3:00 PM', 'Check in and rest.'], ['5:00 PM', 'Short tea-country walk or hostel social time.']],
                note: 'Hill roads are winding. Carry water, keep medication accessible and avoid standing or moving around inside the vehicle.'
            },
            {
                place: 'Munnar tea country',
                time: '8:00 AM-7:00 PM',
                transfer: 'Local shared vehicle; keep the circuit compact',
                stay: 'Munnar or Chinnakanal',
                meals: 'Breakfast, packed or local lunch and dinner',
                summary: 'Choose three strong stops rather than rushing between distant viewpoints: one tea experience, one viewpoint circuit and one short guided walk.',
                schedule: [['8:00 AM', 'Breakfast and depart before the main traffic.'], ['9:00 AM', 'Tea gardens and a museum or plantation visit.'], ['12:30 PM', 'Lunch near the day route.'], ['2:00 PM', 'Viewpoint circuit or short guided nature walk.'], ['5:00 PM', 'Return to town or the hostel before dusk.']],
                note: 'Use only recognised guides for walks. Weather, park rules and local closures can change the plan, so keep a low-cost indoor backup.'
            },
            {
                place: 'Munnar to Alappuzha',
                time: '6:30 AM-8:30 PM',
                transfer: '5.5-7 hr downhill, traffic dependent',
                stay: 'Alappuzha town or beach',
                meals: 'Breakfast, road lunch and coastal dinner',
                summary: 'This is the longest transfer. Start early, take a proper meal break and choose a shorter afternoon boat ride rather than paying for an overnight houseboat.',
                schedule: [['6:30 AM', 'Early breakfast and checkout.'], ['7:00 AM', 'Start the descent toward Alappuzha.'], ['12:30 PM', 'Lunch and comfort break.'], ['3:00 PM', 'Check in, then join a pre-booked shared shikara or canoe trip.'], ['6:00 PM', 'Beach sunset followed by dinner.']],
                note: 'Confirm the boat type, capacity, life jackets, meeting point and total price before boarding. Keep valuables dry.'
            },
            {
                place: 'Alappuzha to Kochi',
                time: '7:30 AM onward',
                transfer: '1.5-2.5 hr by train, bus or road',
                stay: 'Departure day',
                meals: 'Breakfast and a simple lunch',
                summary: 'Keep the last morning inexpensive and flexible, then make the Kochi connection with enough margin for group delays and luggage.',
                schedule: [['7:30 AM', 'Breakfast and an optional beach or canal-side walk.'], ['9:30 AM', 'Checkout and leave for the station or bus pickup.'], ['12:00 PM', 'Reach Kochi and have lunch if time allows.'], ['2:00 PM', 'Continue to the airport, railway station or onward stay.']],
                note: 'Book the group connection together. When flights or long-distance trains are involved, choose the earlier transfer.'
            }
        ],
        'plan-5-days-seniors.html': [
            {
                place: 'Kochi arrival',
                time: 'Arrival time-8:00 PM',
                transfer: 'Private air-conditioned car to the hotel',
                stay: 'Kochi',
                meals: 'Light meal and early dinner',
                summary: 'Protect the first day from travel fatigue. Check in, confirm room access and leave sightseeing optional.',
                schedule: [['Arrival', 'Meet the driver and travel directly to the hotel.'], ['+90 min', 'Check in, inspect the room and rest.'], ['5:30 PM', 'Optional short waterfront drive or hotel garden time.'], ['7:00 PM', 'Early dinner and a quiet evening.']],
                note: 'Keep medicines, prescriptions, water and one change of clothes in hand luggage rather than the main suitcase.'
            },
            {
                place: 'Fort Kochi by private car',
                time: '9:30 AM-7:30 PM',
                transfer: 'Short car hops with door-to-door pickup',
                stay: 'Kochi',
                meals: 'Breakfast, long lunch and early dinner',
                summary: 'Use a car between two or three selected sights, with seated breaks and a full afternoon rest before any evening programme.',
                schedule: [['9:30 AM', 'Leave after breakfast for the Fort Kochi waterfront.'], ['10:15 AM', 'Short walk near the fishing nets and St. Francis Church.'], ['12:00 PM', 'Seated museum visit or shaded cafe stop.'], ['1:00 PM', 'Long lunch, then return to the hotel to rest.'], ['6:00 PM', 'Optional seated Kathakali show with pre-arranged transport.']],
                note: 'Cobbled streets and uneven pavements are common. Ask the driver to minimise walking and confirm seating at every stop.'
            },
            {
                place: 'Kochi to Kumarakom',
                time: '9:30 AM-6:30 PM',
                transfer: '1.5-2.5 hr private road transfer',
                stay: 'Kumarakom',
                meals: 'Breakfast, hotel lunch and dinner',
                summary: 'Leave after rush hour, include one comfort stop if needed and reach the lakeside hotel before lunch or early afternoon.',
                schedule: [['9:30 AM', 'Breakfast, checkout and depart Kochi.'], ['10:45 AM', 'Optional comfort stop.'], ['12:00 PM', 'Reach Kumarakom and check in.'], ['1:00 PM', 'Lunch followed by a long rest.'], ['5:00 PM', 'Garden, lake view or a short buggy-assisted property round.']],
                note: 'Request a room near reception or dining, and confirm whether the vehicle can reach the room block without steps.'
            },
            {
                place: 'Vembanad Lake and Kumarakom',
                time: '9:30 AM-7:00 PM',
                transfer: 'Hotel pickup and a short covered cruise',
                stay: 'Kumarakom',
                meals: 'All meals at or near the resort',
                summary: 'Choose a two-hour daytime motorboat or shikara cruise with shade, stable seating and boarding assistance confirmed beforehand.',
                schedule: [['9:30 AM', 'Slow breakfast and free morning.'], ['11:00 AM', 'Board a covered boat with assistance.'], ['1:00 PM', 'Return for lunch and rest.'], ['4:30 PM', 'Optional short lakeside activity or tea.'], ['7:00 PM', 'Early dinner at the resort.']],
                note: 'Avoid a boat if boarding, weather or balance feels unsafe. A lakeside resort day is a complete alternative, not a missed experience.'
            },
            {
                place: 'Kumarakom to Kochi',
                time: '8:30 AM onward',
                transfer: '2-3 hr plus airport or station buffer',
                stay: 'Departure day',
                meals: 'Breakfast and a planned road meal if needed',
                summary: 'Make departure the only commitment. Leave enough time for a comfort stop, traffic and unhurried airport or station procedures.',
                schedule: [['8:30 AM', 'Breakfast and final packing.'], ['10:00 AM', 'Checkout and depart Kumarakom.'], ['11:15 AM', 'Planned comfort stop when needed.'], ['1:00 PM', 'Reach the airport, railway station or Kochi hotel.']],
                note: 'For flights, use the airline reporting time plus a generous road buffer. Request wheelchair assistance from the airline or station in advance when required.'
            }
        ],
        'plan-7-days.html': [
            {
                place: 'Fort Kochi, Kadamakkudy Islands and Mattancherry',
                time: '2 days',
                transfer: 'Airport 1.5-2 hr; Kadamakkudy about 45-60 min each way',
                stay: '2 nights in Fort Kochi',
                meals: 'Daily breakfast; seafood and Kerala dinner options',
                summary: 'Use the first afternoon for Fort Kochi, then give Day 2 an offbeat opening among Kadamakkudy\'s island roads before returning to Kochi\'s heritage quarter.',
                schedule: [['Day 1, 2 PM', 'Check in, walk the Fort Kochi waterfront and watch sunset.'], ['Day 1, 7 PM', 'Relaxed seafood or Kerala dinner near the heritage quarter.'], ['Day 2, 6 AM', 'Leave for Kadamakkudy for sunrise, wetlands, fishing scenes and a slow island drive or cycle.'], ['Day 2, 11 AM', 'Return for Mattancherry, the palace area and spice streets.'], ['Day 2, 6 PM', 'Kathakali performance followed by dinner.']],
                note: 'Kadamakkudy is most atmospheric early and has limited visitor infrastructure. Carry water, respect working villages and avoid blocking narrow island roads.'
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
                place: 'Thekkady to Munroe Island via Kollam district',
                time: '7:00 AM-9:00 PM',
                transfer: 'About 5-6.5 hr by road',
                stay: 'Munroe Island homestay',
                meals: 'Breakfast, road lunch and homestay dinner',
                summary: 'This is the route\'s offbeat backwater day: arrive in time for a small-canoe journey through narrow canals and a quiet island evening.',
                schedule: [['7:00 AM', 'Breakfast, checkout and depart Thekkady.'], ['12:30 PM', 'Lunch stop before continuing toward Munroe Island.'], ['3:00 PM', 'Check into the homestay and take a short rest.'], ['4:00 PM', 'Join a pre-booked canoe ride through palm-lined village canals.'], ['7:30 PM', 'Local dinner and overnight on the island.']],
                note: 'Use a small canoe for the narrow canals and confirm the meeting point with the homestay. Water level, rain and local conditions can change the route.'
            },
            {
                place: 'Munroe Island to Varkala and Thiruvananthapuram',
                time: '7:00 AM onward',
                transfer: 'About 1.5 hr to Varkala; 1.5-2 hr onward to airport',
                stay: 'Departure day or add one beach night',
                meals: 'Breakfast and coastal lunch',
                summary: 'Finish with Varkala\'s cliff path, beach and cafes before continuing to Thiruvananthapuram. A late flight or an extra beach night makes this day work best.',
                schedule: [['7:00 AM', 'Breakfast, an optional short island walk and checkout.'], ['9:00 AM', 'Depart Munroe Island for Varkala.'], ['10:30 AM', 'Walk the cliff path and choose beach time or a wellness session.'], ['1:30 PM', 'Coastal lunch with a generous weather buffer.'], ['4:00 PM', 'Leave for Thiruvananthapuram or check in for an added night.']],
                note: 'Do not force the coast before an early departure. Varkala is about 35 km from Munroe Island by the official activity guidance, but road time varies.'
            }
        ],
        'plan-10-days.html': [
            {
                place: 'Fort Kochi, Kadamakkudy Islands and Mattancherry',
                time: '2 days',
                transfer: 'Airport 1.5-2 hr; Kadamakkudy about 45-60 min each way',
                stay: '2 nights in Fort Kochi',
                meals: 'Daily breakfast plus two local dinners',
                summary: 'Use Day 1 for Fort Kochi, then start Day 2 in Kadamakkudy\'s quieter island landscape before returning for Mattancherry, culture and food.',
                schedule: [['Day 1, 2 PM', 'Check in and explore the Fort Kochi waterfront.'], ['Day 1, 7 PM', 'Relaxed local dinner in the heritage quarter.'], ['Day 2, 6 AM', 'Sunrise drive or cycle through Kadamakkudy\'s island roads and wetlands.'], ['Day 2, 11 AM', 'Return for Mattancherry heritage area and spice streets.'], ['Day 2, 6 PM', 'Kathakali performance and a food-led evening.']],
                note: 'Treat Kadamakkudy as a living village, not a staged attraction. Keep the visit quiet, carry water and return before midday heat.'
            },
            {
                place: 'Kochi to Munroe Island',
                time: '8:00 AM-9:00 PM',
                transfer: 'About 3.5-5 hr by road or rail connection via Kollam',
                stay: 'Munroe Island homestay',
                meals: 'Breakfast, road lunch and homestay dinner',
                summary: 'Trade the large houseboat circuit for a quieter island stay and an intimate canoe journey through narrow village waterways.',
                schedule: [['8:00 AM', 'Checkout and depart Kochi.'], ['1:00 PM', 'Reach Munroe Island, have lunch and check into the homestay.'], ['3:30 PM', 'Walk or cycle through the village at an easy pace.'], ['4:30 PM', 'Join a pre-booked small-canoe trip through the narrow canals.'], ['8:00 PM', 'Local dinner and overnight on the island.']],
                note: 'Confirm the canoe departure point and next morning pickup with the homestay. Water levels and weather can alter the canal route.'
            },
            {
                place: 'Munroe Island to Munnar and the high country',
                time: '2 days',
                transfer: 'About 5.5-7 hr uphill on Day 4',
                stay: '2 nights in Munnar',
                meals: 'Daily breakfast, road lunch and dinners',
                summary: 'Day 4 is a long scenic transfer. Keep Day 5 for the main tea-country circuit, viewpoints and a plantation experience.',
                schedule: [['Day 4, 7 AM', 'Leave Munroe Island after an early breakfast.'], ['Day 4, 1 PM', 'Lunch en route and continue into the hills.'], ['Day 4, 4:30 PM', 'Munnar check-in and a short evening walk.'], ['Day 5, 8 AM', 'Tea gardens, viewpoints and waterfall route.'], ['Day 5, 2 PM', 'Plantation experience, cafe stop and an early return.']],
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
                note: 'Confirm the next transfer before arrival. Thekkady to Wayanad is a long northbound transfer across Kerala and needs an early start.'
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
                place: 'Wayanad to Valiyaparamba Islands and Bekal',
                time: '2 days',
                transfer: 'About 5-7 hr to north Kasaragod, then local coastal transfers',
                stay: 'Valiyaparamba or Bekal',
                meals: 'Daily breakfast and a Malabar food experience',
                summary: 'End with north Kerala\'s less-crowded island backwaters: cruise Valiyaparamba, taste Malabar cooking and keep the final evening for Bekal Fort.',
                schedule: [['Day 9, 7:30 AM', 'Leave Wayanad after breakfast for the north coast.'], ['Day 9, 2 PM', 'Reach the Valiyaparamba area, check in and have lunch.'], ['Day 9, 4 PM', 'Take a short cruise or canoe ride through the islands and village waterways.'], ['Day 10, 8 AM', 'Slow island morning, then continue to Bekal Fort and the coast.'], ['Day 10, 1 PM', 'Lunch followed by the airport or railway transfer with a generous buffer.']],
                note: 'Organised cruises commonly use Kottappuram as an access point. Bekal pairs best with Kannur or Mangaluru connections, so confirm the departure before booking.'
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

        const mediaCredits = {
            'plan-7-days.html': 'Offbeat photographs: <a href="https://commons.wikimedia.org/wiki/File:Kadamakkudi_island_in_Kerala.jpg" target="_blank" rel="noopener">Kadamakkudy by NOORAPARAPOYIL</a> and <a href="https://commons.wikimedia.org/wiki/File:Munroe_Island_tourism.jpg" target="_blank" rel="noopener">Munroe Island by Sanu N</a>, CC BY-SA 4.0. Varkala image from Kerala Tourism.',
            'plan-10-days.html': 'Offbeat photographs: <a href="https://commons.wikimedia.org/wiki/File:Kadamakkudi_island_in_Kerala.jpg" target="_blank" rel="noopener">Kadamakkudy by NOORAPARAPOYIL</a> and <a href="https://commons.wikimedia.org/wiki/File:Munroe_Island_tourism.jpg" target="_blank" rel="noopener">Munroe Island by Sanu N</a>, CC BY-SA 4.0. Valiyaparamba image from Kerala Tourism.'
        };

        if (mediaCredits[currentPlanFile]) {
            const credit = document.createElement('p');
            credit.className = 'media-credit';
            credit.innerHTML = mediaCredits[currentPlanFile];
            document.querySelector('.plan-day-list')?.insertAdjacentElement('afterend', credit);
        }
    }

    // Indicative room bands make hotel options comparable without presenting them as live quotes.
    const hotelPriceBands = {
        'Forte Kochi': 'INR 11,000-18,000',
        'Zostel Kochi (Ernakulam)': 'INR 700-2,800',
        'The Hosteller Munnar': 'INR 700-3,500',
        'Zostel Alleppey': 'INR 700-2,800',
        'KTDC Bolgatty Palace': 'INR 6,500-12,000',
        'Punnamada Resort': 'INR 8,000-14,000',
        'KTDC Waterscapes': 'INR 6,000-10,000',
        'Coconut Lagoon': 'INR 18,000-30,000',
        'KTDC Tea County': 'INR 6,000-10,000',
        'KTDC Aranya Nivas': 'INR 5,500-9,000',
        'Spice Village': 'INR 16,000-26,000',
        'Gateway Varkala': 'INR 10,000-18,000',
        'Munroe Inn Homestay': 'INR 2,000-4,500',
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

    const fallbackCopyPageLink = pageUrl => {
        const previousFocus = document.activeElement;
        const textArea = document.createElement('textarea');
        textArea.value = pageUrl;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.append(textArea);
        textArea.select();

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch {
            copied = false;
        }

        textArea.remove();
        if (previousFocus instanceof HTMLElement) previousFocus.focus();
        return copied;
    };

    document.querySelectorAll('[data-copy-page-link]').forEach(button => {
        const utilityGroup = button.closest('.footer-utility-actions');
        const status = utilityGroup?.querySelector('[data-copy-page-status]');
        let statusTimer;

        const showCopyStatus = message => {
            if (!status) return;
            status.textContent = message;
            window.clearTimeout(statusTimer);
            statusTimer = window.setTimeout(() => {
                status.textContent = '';
            }, 5000);
        };

        button.addEventListener('click', async () => {
            const pageUrl = window.location.href;

            try {
                if (navigator.clipboard?.writeText && window.isSecureContext) {
                    await navigator.clipboard.writeText(pageUrl);
                } else if (!fallbackCopyPageLink(pageUrl)) {
                    throw new Error('Clipboard access unavailable');
                }

                showCopyStatus('Page link copied.');
            } catch {
                showCopyStatus('Copy unavailable. Use your browser address bar.');
            }
        });
    });

    // Public excerpts and private browser notes remain separate by design.
    const publicReviewList = document.getElementById('public-review-list');
    const localReviewList = document.getElementById('local-review-list');
    const reviewForm = document.getElementById('review-form');

    if (publicReviewList && localReviewList && reviewForm) {
        const reviewStorageKey = 'visitKeralaLocalReviews';
        const publicReviews = [
            { name: 'Dr. Gayathri G', place: 'St. Francis CSI Church, Fort Kochi', rating: 4.3, message: 'A must-visit landmark widely celebrated for its long history in Fort Kochi.', sourceUrl: 'https://www.google.com/maps/search/St.%2BFrancis%2BChurch%2C%2BKochi%2C%2BIndia', checked: 'August 2026' },
            { name: 'Nilima Pawar', place: 'The Valle Munnar', rating: 4.8, message: 'Beautiful sunrise views and attentive service made the hill stay memorable.', sourceUrl: 'https://www.google.com/travel/hotels/entity/ChoI9tG0_YuCgvOcARoNL2cvMTFsNzJtenQ0ahAB', checked: 'August 2026' },
            { name: 'Aliasgar Patwa', place: 'The World Backwaters, Alappuzha', rating: 4.4, message: 'A scenic waterside location with welcoming staff, comfortable rooms and enjoyable food.', sourceUrl: 'https://www.google.com/travel/hotels/entity/ChgIy9CG7N6Top5eGgwvZy8xMXljeWR2ZGwQAQ', checked: 'August 2026' },
            { name: 'Rushikesh Patil', place: 'Cliff County Varkala', rating: 4.1, message: 'A convenient location close to the cliffside restaurants and shopping area.', sourceUrl: 'https://www.google.com/travel/hotels/entity/ChkI14z9laHNj5lUGg0vZy8xMXY1dDM2al8zEAE', checked: 'August 2026' }
        ];

        const loadLocalReviews = () => {
            try {
                const saved = JSON.parse(localStorage.getItem(reviewStorageKey));
                return Array.isArray(saved) ? saved : [];
            } catch {
                return [];
            }
        };
        const saveLocalReviews = reviews => localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
        const calculatePublicAverage = reviews => reviews.length
            ? Math.round((reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length) * 10) / 10
            : null;
        const starMarkup = rating => Array.from({ length: 5 }, (_, index) => {
            const difference = rating - index;
            return `<i class="${difference >= 1 ? 'fa-solid fa-star' : difference >= 0.25 ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star'}" aria-hidden="true"></i>`;
        }).join('');

        const createReviewCard = (review, isPublic) => {
            const card = document.createElement('article');
            const topLine = document.createElement('div');
            const stars = document.createElement('div');
            const quote = document.createElement('blockquote');
            const footer = document.createElement('div');
            const avatar = document.createElement('div');
            const identity = document.createElement('div');
            const name = document.createElement('strong');
            const context = document.createElement('span');
            const source = isPublic ? document.createElement('a') : document.createElement('span');
            const initials = String(review.name).split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();

            card.className = `review-card reveal active ${isPublic ? 'google-review' : 'local-review'}`;
            if (!isPublic) card.dataset.reviewId = review.id;
            topLine.className = 'review-card-topline';
            stars.className = 'review-stars';
            stars.setAttribute('aria-label', `${review.rating} out of 5`);
            stars.innerHTML = starMarkup(review.rating);
            source.className = `review-source-stamp${isPublic ? '' : ' local-source-stamp'}`;
            source.textContent = isPublic ? 'Public Google excerpt' : 'Saved on this device';
            if (isPublic) {
                source.href = review.sourceUrl;
                source.target = '_blank';
                source.rel = 'noopener';
                source.setAttribute('aria-label', `Open public Google source for ${review.place}`);
            }
            topLine.append(stars, source);
            quote.textContent = `“${review.message}”`;
            avatar.className = 'review-avatar';
            avatar.textContent = initials || 'VK';
            footer.className = 'review-card-footer';
            name.textContent = review.name;
            context.textContent = isPublic ? review.place : review.plan;
            identity.append(name, context);
            const meta = document.createElement('small');
            meta.className = 'review-rating-meta';
            meta.textContent = isPublic
                ? `${review.rating.toFixed(1)} public place rating · Checked ${review.checked}`
                : `${review.traveller || 'Traveller'}${review.month ? ` · ${review.month}` : ''} · Not independently verified.`;
            identity.append(meta);
            footer.append(avatar, identity);
            if (!isPublic) {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'delete-local-review';
                removeButton.dataset.deleteReview = review.id;
                removeButton.setAttribute('aria-label', `Delete review by ${review.name}`);
                removeButton.innerHTML = '<i class="fa-regular fa-trash-can" aria-hidden="true"></i>';
                footer.append(removeButton);
            }
            card.append(topLine, quote, footer);
            return card;
        };

        const renderPublicReviews = () => {
            publicReviewList.replaceChildren(...publicReviews.map(review => createReviewCard(review, true)));
            const average = calculatePublicAverage(publicReviews);
            const averageElement = document.getElementById('public-review-average');
            const starsElement = document.getElementById('public-review-stars');
            const summaryElement = document.getElementById('public-review-summary');
            averageElement.textContent = average === null ? '—' : `${average.toFixed(1)}/5`;
            starsElement.innerHTML = average === null ? '' : starMarkup(average);
            summaryElement.textContent = average === null
                ? 'No supported public rating is available.'
                : `Average across ${publicReviews.length} featured public places · Reviewed August 2026`;
        };
        const renderLocalReviews = () => {
            const reviews = loadLocalReviews();
            if (!reviews.length) {
                const empty = document.createElement('p');
                empty.className = 'empty-local-reviews';
                empty.textContent = 'No local reviews saved yet.';
                localReviewList.replaceChildren(empty);
            } else {
                localReviewList.replaceChildren(...reviews.map(review => createReviewCard(review, false)));
            }
            document.getElementById('clear-local-reviews').disabled = !reviews.length;
        };
        const validateLocalReview = review => {
            if (!review.name || review.name.length > 50) return 'Enter a name of 50 characters or fewer.';
            if (!review.message || review.message.length < 10 || review.message.length > 500) return 'Write a review between 10 and 500 characters.';
            if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) return 'Choose a rating from 1 to 5.';
            return '';
        };

        renderPublicReviews();
        renderLocalReviews();
        const reviewMessage = document.getElementById('review-message');
        reviewMessage.addEventListener('input', () => {
            document.getElementById('review-character-count').textContent = reviewMessage.value.length;
        });
        reviewForm.addEventListener('submit', event => {
            event.preventDefault();
            const review = {
                id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: document.getElementById('review-name').value.trim(),
                plan: document.getElementById('review-plan').value,
                rating: Number(reviewForm.querySelector('input[name="rating"]:checked')?.value),
                message: reviewMessage.value.trim(),
                month: document.getElementById('review-month').value,
                traveller: document.getElementById('review-traveller').value
            };
            const status = document.getElementById('review-status');
            const validationMessage = validateLocalReview(review);
            if (validationMessage) {
                status.textContent = validationMessage;
                return;
            }
            saveLocalReviews([review, ...loadLocalReviews()]);
            reviewForm.reset();
            document.getElementById('review-character-count').textContent = '0';
            renderLocalReviews();
            status.textContent = 'Review saved only on this device.';
        });
        localReviewList.addEventListener('click', event => {
            const button = event.target.closest('[data-delete-review]');
            if (!button) return;
            saveLocalReviews(loadLocalReviews().filter(review => review.id !== button.dataset.deleteReview));
            renderLocalReviews();
            document.getElementById('review-status').textContent = 'Local review deleted.';
        });
        document.getElementById('clear-local-reviews').addEventListener('click', () => {
            if (!loadLocalReviews().length || !window.confirm('Clear all reviews saved in this browser?')) return;
            localStorage.removeItem(reviewStorageKey);
            renderLocalReviews();
            document.getElementById('review-status').textContent = 'All local reviews cleared.';
        });
        window.__keralaReviews = {
            publicReviews: publicReviews.map(review => ({ ...review })),
            calculatePublicAverage,
            getLocalReviews: loadLocalReviews,
            validateLocalReview,
            addLocalReview: review => { const message = validateLocalReview(review); if (message) throw new Error(message); saveLocalReviews([{ ...review, id: review.id || `review-${Date.now()}` }, ...loadLocalReviews()]); },
            deleteLocalReview: id => saveLocalReviews(loadLocalReviews().filter(review => review.id !== id)),
            clearLocalReviews: () => localStorage.removeItem(reviewStorageKey)
        };
    }

    // Trip preferences stay on the visitor's device and can prefill the Plan Finder.
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        const preferenceStorageKey = 'visitKeralaTripPreferences';
        const recommendationStorageKey = 'visitKeralaLatestRecommendation';
        const profileStatus = document.getElementById('profile-status');
        const interestStatus = document.getElementById('profile-interest-status');
        const interestInputs = [...profileForm.querySelectorAll('input[name="interests"]')];
        const safeRead = key => {
            try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
        };
        const readPreferenceForm = () => ({
            name: document.getElementById('profile-name').value.trim(),
            city: document.getElementById('profile-city').value.trim(),
            traveller: document.getElementById('profile-traveller').value,
            pace: document.getElementById('profile-pace').value,
            comfort: document.getElementById('profile-comfort').value,
            experiences: interestInputs.filter(input => input.checked).map(input => input.value).slice(0, 3)
        });
        const updateInterestState = message => {
            const count = interestInputs.filter(input => input.checked).length;
            interestStatus.textContent = message || `${count} of 3 selected`;
        };
        const savePreferences = () => {
            const preferences = readPreferenceForm();
            localStorage.setItem(preferenceStorageKey, JSON.stringify(preferences));
            profileStatus.textContent = 'Trip preferences saved only on this device.';
            return preferences;
        };
        const renderRecentRecommendation = () => {
            const container = document.getElementById('recent-recommendation');
            const recommendation = safeRead(recommendationStorageKey);
            if (!recommendation?.name || !recommendation?.url) {
                container.innerHTML = '<p>No plan recommendation has been saved yet.</p><a class="profile-finder-link" href="itineraries.html#trip-finder-title">Open Plan Finder <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i></a>';
                return;
            }
            const title = document.createElement('h3');
            const match = document.createElement('strong');
            const route = document.createElement('p');
            const actions = document.createElement('div');
            title.textContent = recommendation.name;
            match.textContent = `${recommendation.matchPercentage}% match`;
            route.textContent = recommendation.route;
            actions.className = 'recent-recommendation-actions';
            [['View Full Plan', recommendation.url], ['Estimate Budget', recommendation.budgetUrl], ['View on Map', recommendation.mapUrl]].forEach(([label, url]) => {
                const link = document.createElement('a');
                link.href = url;
                link.textContent = label;
                actions.append(link);
            });
            container.replaceChildren(title, match, route, actions);
        };

        const stored = safeRead(preferenceStorageKey) || {};
        document.getElementById('profile-name').value = stored.name || '';
        document.getElementById('profile-city').value = stored.city || '';
        document.getElementById('profile-traveller').value = stored.traveller || 'family';
        document.getElementById('profile-pace').value = stored.pace || 'balanced';
        document.getElementById('profile-comfort').value = stored.comfort || 'comfortable';
        interestInputs.forEach(input => { input.checked = Array.isArray(stored.experiences) && stored.experiences.includes(input.value); });
        updateInterestState();
        renderRecentRecommendation();
        interestInputs.forEach(input => input.addEventListener('change', () => {
            const selected = interestInputs.filter(option => option.checked);
            if (selected.length > 3) {
                input.checked = false;
                updateInterestState('Choose up to three experiences. Remove one before adding another.');
            } else updateInterestState();
        }));
        profileForm.addEventListener('submit', event => { event.preventDefault(); savePreferences(); });
        document.getElementById('profile-use-finder').addEventListener('click', () => {
            savePreferences();
            window.location.href = 'itineraries.html?preferences=1#trip-finder-title';
        });
        document.getElementById('profile-reset').addEventListener('click', () => {
            localStorage.removeItem(preferenceStorageKey);
            profileForm.reset();
            interestInputs.forEach(input => { input.checked = false; });
            document.getElementById('profile-traveller').value = 'family';
            document.getElementById('profile-pace').value = 'balanced';
            document.getElementById('profile-comfort').value = 'comfortable';
            updateInterestState();
            profileStatus.textContent = 'Trip preferences cleared from this device.';
        });
        window.__keralaTripPreferences = { read: () => safeRead(preferenceStorageKey), save: savePreferences, recent: () => safeRead(recommendationStorageKey) };
    }

    // ==========================================
    // 7. Floating Kerala Travel Assistant
    // ==========================================
    const assistantWidget = document.createElement('aside');
    assistantWidget.className = 'assistant-widget';
    assistantWidget.setAttribute('aria-label', 'Kerala travel assistant');
    assistantWidget.innerHTML = `
        <section class="assistant-panel" id="kerala-assistant-panel" aria-label="Kerala travel assistant" aria-live="polite">
            <header class="assistant-header"><div class="assistant-heading"><i class="fa-solid fa-compass"></i><div><strong>Kerala Travel Guide</strong><span>Places, plans, budgets, and practical tips</span></div></div><div class="assistant-header-actions"><button class="assistant-clear" type="button" title="Clear conversation" aria-label="Clear conversation"><i class="fa-regular fa-trash-can"></i></button><button class="assistant-close" type="button" title="Close assistant" aria-label="Close assistant"><i class="fa-solid fa-xmark"></i></button></div></header>
            <div class="assistant-messages" id="assistant-messages"></div>
            <div class="assistant-composer"><div class="assistant-suggestions" id="assistant-suggestions"></div><form class="assistant-form"><input id="assistant-input" type="text" placeholder="Ask about Kerala..." autocomplete="off" aria-label="Ask a Kerala travel question"><button class="assistant-send" type="submit" title="Send question" aria-label="Send question"><i class="fa-solid fa-arrow-up"></i></button></form></div>
        </section>
        <button class="assistant-toggle" id="kerala-assistant-toggle" type="button" title="Ask Kerala Travel Assistant" aria-label="Open Kerala Travel Assistant" aria-expanded="false"><i class="fa-solid fa-wand-magic-sparkles"></i></button>`;
    document.body.append(assistantWidget);

    const assistantPanel = document.getElementById('kerala-assistant-panel');
    const assistantToggle = document.getElementById('kerala-assistant-toggle');
    const assistantClose = assistantWidget.querySelector('.assistant-close');
    const assistantClear = assistantWidget.querySelector('.assistant-clear');
    const assistantMessages = document.getElementById('assistant-messages');
    const assistantSuggestions = document.getElementById('assistant-suggestions');
    const assistantForm = assistantWidget.querySelector('.assistant-form');
    const assistantInput = document.getElementById('assistant-input');

    const assistantReplies = [
        {
            id: 'help',
            suggestion: 'What can you answer?',
            questions: ['What can you help me with?', 'What questions can I ask?', 'How does this guide work?', 'Can you help plan my Kerala trip?', 'What do you know about Kerala?'],
            terms: ['help me', 'what can you answer', 'what can i ask', 'kerala guide'],
            text: "Ask me about trip lengths, routes, destinations, budgets, hotels, transport, weather, food, safety, backwaters, beaches, culture, or offbeat places. I use a built-in Kerala travel question bank, so no account or AI service is needed.",
            link: ['itineraries.html', 'Browse all trip plans'],
            related: ['choose-plan', 'best-time', 'budget-general']
        },
        {
            id: 'contact',
            suggestion: 'Tourism contact',
            questions: ['What is the Kerala Tourism contact number?', 'Who can I call for Kerala tourism help?', 'Is there an official tourism helpline?', 'Where can I find official Kerala travel information?', 'How do I contact Kerala Tourism?'],
            terms: ['contact number', 'tourism helpline', 'call kerala tourism', 'official contact'],
            text: "The contact shown on this site is Kerala Tourism: +91 471 232 1132. For current notices, opening details, and official help, use the government tourism links on the Travel Info page.",
            link: ['travel-info.html', 'Open official travel links'],
            related: ['official-info', 'safety', 'booking']
        },
        {
            id: 'official-info',
            suggestion: 'Official information',
            questions: ['Is this the official Kerala Tourism website?', 'Where does this travel information come from?', 'Where can I verify Kerala travel details?', 'Are the timings and prices official?', 'Which government website should I check?'],
            terms: ['official website', 'government website', 'verify information', 'official information'],
            text: "Visit Kerala is an independent planning website inspired by Kerala Tourism resources. Always verify live prices, permits, weather alerts, opening hours, and transport changes on the linked official pages before booking.",
            link: ['travel-info.html', 'Verify with official sources'],
            related: ['contact', 'booking', 'best-time']
        },
        {
            id: 'choose-plan',
            suggestion: 'Choose my plan',
            questions: ['Which Kerala plan should I choose?', 'How many days are enough for Kerala?', 'What is the best Kerala itinerary?', 'Which trip length is right for me?', 'Should I choose 3, 5, 7, or 10 days?', 'Help me select a Kerala vacation plan.'],
            terms: ['which plan', 'how many days', 'best itinerary', 'choose a trip', 'trip length'],
            text: "Choose 3 days for Kochi plus one backwater night, 5 days for the classic hills-and-houseboat route, 7 days for a fuller south Kerala trip with offbeat islands, or 10 days for a wide route reaching Wayanad and north Kerala.",
            link: ['itineraries.html', 'Compare the plans'],
            related: ['plan-3', 'plan-5', 'plan-7', 'plan-10']
        },
        {
            id: 'plan-3',
            suggestion: '3-day trip',
            questions: ['What is included in the 3-day plan?', 'Can I visit Kerala in three days?', 'What should I do on a Kerala weekend?', 'Is the 3-day plan good for first-time visitors?', 'Which places are covered in three days?', 'Give me a short Kerala itinerary.'],
            terms: ['3 day', 'three day', 'short kerala trip', 'kerala weekend', 'long weekend'],
            text: "The 3-day route covers Fort Kochi and Mattancherry, then an Alappuzha houseboat night and morning cruise. It is the simplest short introduction and avoids squeezing hill stations into a weekend.",
            link: ['plan-3-days.html', 'Open the 3-day plan'],
            related: ['budget-3', 'kochi', 'houseboat']
        },
        {
            id: 'plan-5',
            suggestion: '5-day trip',
            questions: ['What is included in the 5-day plan?', 'Is five days enough for Kerala?', 'What is the best five-day Kerala route?', 'Which places are covered in five days?', 'Can I see Munnar and backwaters in five days?', 'Plan a five-day Kerala vacation.'],
            terms: ['5 day', 'five day', 'five days', 'munnar and backwaters'],
            text: "The 5-day route is the best compact classic: Kochi, Munnar, Thekkady, and Alappuzha. It gives you heritage, tea hills, spice country, and a houseboat without adding the longer north Kerala transfers.",
            link: ['plan-5-days.html', 'Open the 5-day plan'],
            related: ['budget-5', 'munnar', 'thekkady', 'alappuzha']
        },
        {
            id: 'plan-7',
            suggestion: '7-day trip',
            questions: ['What is included in the 7-day plan?', 'Is one week enough for Kerala?', 'What is the best seven-day Kerala itinerary?', 'Which offbeat places are in the 7-day plan?', 'Can I include Varkala in a one-week trip?', 'Plan a week in Kerala.'],
            terms: ['7 day', 'seven day', 'one week', 'week in kerala'],
            text: "The 7-day plan combines Fort Kochi, Kadamakkudy Islands, Munnar, Thekkady, Munroe Island, and Varkala. It is the strongest first big trip because it mixes famous highlights with quieter island experiences.",
            link: ['plan-7-days.html', 'Open the 7-day plan'],
            related: ['budget-7', 'offbeat', 'munroe', 'varkala']
        },
        {
            id: 'plan-10',
            suggestion: '10-day trip',
            questions: ['What is included in the 10-day plan?', 'What can I see in ten days in Kerala?', 'Which offbeat places are in the 10-day itinerary?', 'Can I visit north and south Kerala in ten days?', 'Is the 10-day trip too rushed?', 'Plan a long Kerala holiday.'],
            terms: ['10 day', 'ten day', 'ten days', 'long kerala trip', 'north and south kerala'],
            text: "The 10-day route goes from Kochi and Kadamakkudy to Munroe Island, Munnar, Thekkady, Wayanad, Valiyaparamba, and Bekal. It is varied but includes major transfers, so break the longest road day if you prefer a slow pace.",
            link: ['plan-10-days.html', 'Open the 10-day plan'],
            related: ['budget-10', 'offbeat', 'wayanad', 'valiyaparamba']
        },
        {
            id: 'family',
            suggestion: 'Travel with kids',
            questions: ['Is Kerala good for families?', 'Which Kerala plan is best with children?', 'What can kids do in Kerala?', 'Is a houseboat safe for children?', 'Can we travel Kerala with school-age kids?', 'Which places are family friendly?'],
            terms: ['with kids', 'with children', 'family trip', 'family friendly', 'for families'],
            text: "Kerala works well for families. Keep transfer days light, choose a houseboat with proper railings and life jackets, give Munnar two nights, and favour easy activities such as short walks, boat rides, beaches with safe conditions, and cultural shows.",
            link: ['itineraries.html', 'Compare family-friendly routes'],
            related: ['houseboat', 'beach-safety', 'plan-5']
        },
        {
            id: 'solo',
            suggestion: 'Solo travel',
            questions: ['Is Kerala good for solo travel?', 'Can I travel alone in Kerala?', 'Which route is best for a solo traveller?', 'Is Kerala safe for a woman travelling alone?', 'How should a solo visitor get around?', 'Are homestays good for solo travellers?'],
            terms: ['solo travel', 'travel alone', 'solo traveller', 'woman travelling alone', 'female solo'],
            text: "Solo travel is practical on the main Kerala route. Use reviewed stays and registered transport, share long-transfer details with someone you trust, avoid isolated areas after dark, and choose homestays or small group activities when you want local company.",
            link: ['travel-info.html', 'Read practical travel notes'],
            related: ['safety', 'transport', 'booking']
        },
        {
            id: 'couples',
            suggestion: 'Couples trip',
            questions: ['Which Kerala plan is best for couples?', 'Is Kerala good for a honeymoon?', 'Where should couples stay in Kerala?', 'What is a romantic Kerala itinerary?', 'Should couples choose Munnar or Varkala?', 'Can we book a private houseboat?'],
            terms: ['for couples', 'couples trip', 'honeymoon', 'romantic trip', 'romantic kerala'],
            text: "For couples, the 5-day hills and houseboat route is compact. The 7-day route continues through Munroe Island and finishes in Varkala, while the relaxed 5-day Kochi and Kumarakom route suits travellers who prefer fewer hotel changes.",
            link: ['plan-7-days.html', 'See the 7-day route'],
            related: ['munnar', 'houseboat', 'varkala']
        },
        {
            id: 'seniors',
            suggestion: 'Senior-friendly trip',
            questions: ['Is Kerala suitable for senior citizens?', 'Which Kerala plan is easiest for older travellers?', 'Can we avoid long walks in Kerala?', 'How can seniors travel comfortably in Kerala?', 'Which route has fewer hotel changes?', 'Is the houseboat suitable for elderly guests?'],
            terms: ['senior citizens', 'older travellers', 'elderly', 'senior friendly', 'limited walking'],
            text: "For older travellers, use a private car, choose lifts or ground-floor rooms, avoid changing hotels every night, and confirm houseboat steps and bathroom access. The 3-day route is easiest; a slowed-down 5-day route also works well.",
            link: ['plan-3-days.html', 'See the easiest route'],
            related: ['accessibility', 'transport', 'houseboat']
        },
        {
            id: 'accessibility',
            suggestion: 'Accessibility',
            questions: ['Is Kerala wheelchair accessible?', 'Which places have easy access?', 'Can someone with limited mobility use a houseboat?', 'How do I plan an accessible Kerala trip?', 'Are there many stairs on this route?', 'Can hotels arrange accessible rooms?'],
            terms: ['wheelchair', 'accessible trip', 'limited mobility', 'step free', 'mobility needs'],
            text: "Accessibility varies greatly by property, boat, and attraction. Ask hotels for exact doorway, lift, bathroom, and step details; request a vehicle with comfortable entry; and confirm the boarding arrangement before paying for any boat trip.",
            link: ['travel-info.html', 'Open planning resources'],
            related: ['seniors', 'hotel-prices', 'booking']
        },
        {
            id: 'budget-general',
            suggestion: 'Trip budget',
            questions: ['How much does a Kerala trip cost?', 'Is Kerala expensive?', 'What budget should I keep for Kerala?', 'Can I travel Kerala cheaply?', 'What is included in the plan budgets?', 'Do the budgets include flights?'],
            terms: ['trip cost', 'kerala budget', 'how expensive', 'travel cheaply', 'include flights'],
            text: "Each plan has a group budget estimator for Value, Comfortable and Premium travel. Enter the adults, children, seniors and infants travelling to calculate accommodation, local Kerala transport, meals, core activities and the listed cruise. Travel to and from Kerala is excluded.",
            link: ['itineraries.html', 'Compare plan budgets'],
            related: ['budget-3', 'budget-5', 'budget-7', 'budget-10']
        },
        {
            id: 'budget-3',
            suggestion: '3-day cost',
            questions: ['How much does the 3-day Kerala trip cost?', 'What is the budget for three days?', 'Can I do Kerala in three days under 20000 rupees?', 'What is the comfortable budget for the 3-day plan?', 'How much is a short Kochi and Alappuzha trip?'],
            terms: ['3 day cost', 'three day budget', '3 day budget', 'under 20000'],
            text: "The 3-day total depends on your group, travel month, room arrangement and comfort tier. Open its Budget section and enter the travellers to compare Value, Comfortable and Premium group estimates.",
            link: ['plan-3-days.html#budget', 'See the 3-day budget'],
            related: ['plan-3', 'hotel-prices', 'houseboat']
        },
        {
            id: 'budget-5',
            suggestion: '5-day cost',
            questions: ['How much does the 5-day Kerala trip cost?', 'What is the budget for five days?', 'Can I do the 5-day plan cheaply?', 'What is the comfortable budget for five days?', 'How much is the Kochi Munnar Thekkady trip?'],
            terms: ['5 day cost', 'five day budget', '5 day budget', 'cost for five days'],
            text: "The 5-day total depends on your group, travel month, rooms, vehicle and houseboat cabin needs. Its Budget section calculates three planning ranges for the entire entered group; travel to Kerala remains separate.",
            link: ['plan-5-days.html#budget', 'See the 5-day budget'],
            related: ['plan-5', 'hotel-prices', 'transport']
        },
        {
            id: 'budget-7',
            suggestion: '7-day cost',
            questions: ['How much does the 7-day Kerala trip cost?', 'What is the budget for one week?', 'How much money do I need for seven days?', 'What is the comfortable budget for the 7-day plan?', 'Is the one-week itinerary expensive?'],
            terms: ['7 day cost', 'seven day budget', 'one week budget', '7 day budget'],
            text: "The 7-day total is calculated for your actual group using the season, room count, route transport, meals and listed experiences. Use the plan's Budget section for Value, Comfortable and Premium group estimates.",
            link: ['plan-7-days.html#budget', 'See the 7-day budget'],
            related: ['plan-7', 'hotel-prices', 'offbeat']
        },
        {
            id: 'budget-10',
            suggestion: '10-day cost',
            questions: ['How much does the 10-day Kerala trip cost?', 'What is the budget for ten days?', 'How much money do I need for the long trip?', 'What is the comfortable budget for the 10-day plan?', 'Is north Kerala costly to include?'],
            terms: ['10 day cost', 'ten day budget', '10 day budget', 'long trip cost'],
            text: "The 10-day estimator accounts for its long cross-Kerala transfers, group-size vehicle, rooms, meals and activities. Enter your group and month in the Budget section to see all three indicative 2026 planning ranges.",
            link: ['plan-10-days.html#budget', 'See the 10-day budget'],
            related: ['plan-10', 'transport', 'hotel-prices']
        },
        {
            id: 'hotel-prices',
            suggestion: 'Hotels and prices',
            questions: ['Which hotels are included in the plans?', 'How much do Kerala hotels cost?', 'Where should I stay in Munnar?', 'Are hotel prices shown on the site?', 'Can I see possible stays for each plan?', 'Should I book a resort or homestay?'],
            terms: ['hotel prices', 'where to stay', 'possible hotels', 'resort or homestay', 'hotel options'],
            text: "Each trip page has a Hotels section with possible properties, locations, style tags, and indicative nightly price bands. Treat them as a shortlist and check live rates, taxes, meal plans, distance, and cancellation terms.",
            link: ['itineraries.html', 'Choose a plan and view hotels'],
            related: ['booking', 'budget-general', 'homestays']
        },
        {
            id: 'homestays',
            suggestion: 'Homestays',
            questions: ['Are homestays good in Kerala?', 'Should I stay in a homestay?', 'Where can I find village stays?', 'Is Munroe Island good for a homestay?', 'Are homestays suitable for families?'],
            terms: ['homestay', 'village stay', 'local stay', 'stay with a family'],
            text: "Homestays are especially rewarding on Munroe Island, in Wayanad, and around quieter backwater villages. Check recent reviews, room access, meal arrangements, transport pickup, and whether the host can organise local activities.",
            link: ['destination-munroe-island.html', 'Explore Munroe Island stays'],
            related: ['munroe', 'wayanad', 'booking']
        },
        {
            id: 'best-time',
            suggestion: 'Best time to visit',
            questions: ['What is the best time to visit Kerala?', 'Which month is best for Kerala?', 'When should I plan my Kerala trip?', 'Is winter a good time to visit?', 'What is Kerala like from October to March?', 'When is the tourist season?'],
            terms: ['best time', 'best month', 'when to visit', 'tourist season', 'october to march'],
            text: "October to March is usually the easiest season for a broad Kerala route, with more comfortable sightseeing weather. Hill stations can be cool, while the coast stays warmer. Always check the forecast for your exact dates.",
            link: ['travel-info.html', 'Check seasonal travel notes'],
            related: ['monsoon', 'packing', 'booking']
        },
        {
            id: 'monsoon',
            suggestion: 'Monsoon travel',
            questions: ['Can I visit Kerala during monsoon?', 'Is June a good month for Kerala?', 'What happens during heavy rain?', 'Are houseboats available in monsoon?', 'Is Kerala safe in the rainy season?', 'What can I do when it rains?'],
            terms: ['monsoon', 'rainy season', 'heavy rain', 'visit in june', 'visit in july'],
            text: "Monsoon Kerala is green and atmospheric, but rain can disrupt hill roads, boating, beach access, and outdoor activities. Keep flexible days, avoid tight transfers, check official alerts, and never enter water or trails closed by local authorities.",
            link: ['travel-info.html', 'Open weather and safety links'],
            related: ['rain-backup', 'packing', 'safety']
        },
        {
            id: 'rain-backup',
            suggestion: 'Rainy-day ideas',
            questions: ['What can we do in Kerala on a rainy day?', 'Which activities work when it rains?', 'What is a backup plan for Munnar rain?', 'What indoor attractions are there in Kochi?', 'How do I change the itinerary for bad weather?'],
            terms: ['rainy day', 'backup plan', 'bad weather plan', 'indoor activities'],
            text: "Use rainy periods for museums and cafes in Kochi, a cultural performance, a cooking experience, spice shopping, or a relaxed hotel day. In the hills, shorten viewpoint drives and avoid waterfalls or trails when conditions are unsafe.",
            link: ['experiences.html', 'Browse flexible experiences'],
            related: ['monsoon', 'kochi', 'culture']
        },
        {
            id: 'packing',
            suggestion: 'Packing list',
            questions: ['What should I pack for Kerala?', 'What clothes should I wear in Kerala?', 'Do I need a raincoat?', 'What should I carry for Munnar?', 'What footwear is best?', 'Do I need warm clothes in the hills?'],
            terms: ['what to pack', 'packing list', 'what clothes', 'raincoat', 'footwear', 'warm clothes'],
            text: "Pack light breathable clothing, modest layers for religious sites, comfortable walking shoes, sun protection, insect repellent, a reusable water bottle, and a compact rain layer. Add a light sweater for cool Munnar mornings.",
            link: ['travel-info.html', 'Read practical travel notes'],
            related: ['best-time', 'monsoon', 'health']
        },
        {
            id: 'airports',
            suggestion: 'Nearest airport',
            questions: ['Which airport should I fly to for Kerala?', 'What is the nearest airport to Munnar?', 'Which airport is best for Kochi?', 'How do I fly to Varkala?', 'Which airport works for Wayanad?', 'Can I enter through Kochi and leave from another airport?'],
            terms: ['which airport', 'nearest airport', 'fly to kerala', 'airport for munnar', 'airport for varkala'],
            text: "Kochi is the simplest gateway for the classic Kochi-Munnar-Thekkady-backwaters circuit. Thiruvananthapuram suits Varkala and the south coast. Kozhikode or Kannur may suit Wayanad and north Kerala. An open-jaw route can reduce backtracking.",
            link: ['travel-info.html', 'See arrival planning notes'],
            related: ['transport', 'route-order', 'plan-10']
        },
        {
            id: 'transport',
            suggestion: 'Getting around',
            questions: ['How do I travel around Kerala?', 'Should I hire a private car?', 'Are buses good for tourists?', 'Can I use trains between Kerala cities?', 'Is self-driving easy in Kerala?', 'How long do hill transfers take?', 'Are taxis available?', 'What is the cheapest way to travel?'],
            terms: ['getting around', 'private car', 'public bus', 'by train', 'self drive', 'taxi', 'local transport'],
            text: "Trains work well between larger cities and the coast; buses are economical; a private car is easiest for hills and multi-stop plans. Kerala road distances can look short but take longer than expected, so avoid major sightseeing after long transfers.",
            link: ['travel-info.html', 'Open transport notes'],
            related: ['airports', 'route-order', 'budget-general']
        },
        {
            id: 'route-order',
            suggestion: 'Route order',
            questions: ['What order should I visit Kerala places?', 'Should I go to Munnar or Alappuzha first?', 'How can I avoid backtracking?', 'Where should my Kerala trip start and end?', 'Can I reverse the itinerary?', 'How do I plan airport transfers?'],
            terms: ['route order', 'avoid backtracking', 'start and end', 'reverse itinerary', 'which place first'],
            text: "For a Kochi arrival, a practical classic order is Kochi, Munnar, Thekkady, then Alappuzha or Kumarakom. Continue south to Varkala and depart from Thiruvananthapuram, or return to Kochi if your ticket requires it.",
            link: ['itineraries.html', 'Compare route maps'],
            related: ['airports', 'transport', 'choose-plan']
        },
        {
            id: 'kochi',
            suggestion: 'Kochi',
            questions: ['What should I see in Kochi?', 'How many days do I need in Fort Kochi?', 'Is Kochi worth visiting?', 'What is famous in Mattancherry?', 'Where can I watch Kathakali in Kochi?', 'What food should I try in Kochi?'],
            terms: ['fort kochi', 'mattancherry', 'things to do in kochi', 'visit kochi', 'kochi famous'],
            text: "Give Kochi one or two days for the Fort Kochi waterfront, heritage streets, St. Francis Church, Mattancherry, spice lanes, cafes, and an evening cultural performance. It is also the easiest arrival base for the classic route.",
            link: ['destination-kochi.html', 'Explore Kochi'],
            related: ['culture', 'food', 'kadamakkudy']
        },
        {
            id: 'munnar',
            suggestion: 'Munnar',
            questions: ['What is Munnar famous for?', 'How many days should I stay in Munnar?', 'What can I do in Munnar?', 'Are the tea gardens worth visiting?', 'Is Munnar cold?', 'Where should I stay in Munnar?', 'Can children enjoy Munnar?'],
            terms: ['munnar', 'tea gardens', 'tea estate', 'tea plantation', 'hill station'],
            text: "Munnar is known for tea-covered hills, viewpoints, waterfalls, plantation experiences, and cool mornings. Stay at least two nights, group sights by area, and let weather decide how many viewpoints you attempt.",
            link: ['destination-munnar.html', 'Explore Munnar'],
            related: ['packing', 'plan-5', 'hotel-prices']
        },
        {
            id: 'alappuzha',
            suggestion: 'Alappuzha',
            questions: ['What is Alappuzha famous for?', 'Is Alleppey the same as Alappuzha?', 'What can I do in Alappuzha?', 'Should I stay on a houseboat?', 'How many days are enough for Alappuzha?', 'Are there beaches in Alappuzha?', 'Can I take a day cruise?'],
            terms: ['alappuzha', 'alleppey', 'alappy', 'alappuzha backwaters'],
            text: "Alappuzha, also called Alleppey, is the classic houseboat and backwater base. One overnight cruise or a day cruise plus a land stay is usually enough for a first visit.",
            link: ['destination-alappuzha.html', 'Explore Alappuzha'],
            related: ['houseboat', 'backwater-choice', 'plan-3']
        },
        {
            id: 'kumarakom',
            suggestion: 'Kumarakom',
            questions: ['What can I do in Kumarakom?', 'Is Kumarakom better than Alleppey?', 'Where should I stay near Vembanad Lake?', 'Is Kumarakom good for birdwatching?', 'How many nights should I spend in Kumarakom?', 'Can I do a backwater resort instead of a houseboat?'],
            terms: ['kumarakom', 'vembanad lake', 'bird sanctuary', 'backwater resort'],
            text: "Kumarakom suits travellers who prefer a slower lakeside resort stay, birding, and shorter cruises. Choose it over Alappuzha when comfort and a relaxed base matter more than the classic overnight houseboat route.",
            link: ['destination-kumarakom.html', 'Explore Kumarakom'],
            related: ['backwater-choice', 'houseboat', 'hotel-prices']
        },
        {
            id: 'thekkady',
            suggestion: 'Thekkady',
            questions: ['What is Thekkady famous for?', 'What can I do near Periyar?', 'Is Periyar boating worth it?', 'How many nights should I stay in Thekkady?', 'Can I visit a spice garden?', 'Will I see elephants in Periyar?', 'Is Thekkady suitable for children?'],
            terms: ['thekkady', 'periyar', 'spice garden', 'tiger reserve', 'periyar boating'],
            text: "Thekkady is the base for the Periyar landscape, spice gardens, nature activities, and cultural evenings. Plan one night, choose one main activity, and never expect guaranteed wildlife sightings.",
            link: ['experiences.html', 'Explore nature experiences'],
            related: ['wildlife', 'plan-5', 'culture']
        },
        {
            id: 'wayanad',
            suggestion: 'Wayanad',
            questions: ['What is Wayanad famous for?', 'How many days should I stay in Wayanad?', 'What can I do in Wayanad?', 'Is Wayanad good for nature lovers?', 'Can I add Wayanad to a south Kerala trip?', 'Where should I stay in Wayanad?'],
            terms: ['wayanad', 'edakkal', 'wayanad forest', 'wayanad waterfalls'],
            text: "Wayanad offers rainforest stays, plantations, caves, waterfalls, and highland scenery. Give it two or three nights. It is far from the classic south Kerala circuit, so it fits the 10-day plan better than a short trip.",
            link: ['destination-wayanad.html', 'Explore Wayanad'],
            related: ['plan-10', 'wildlife', 'hotel-prices']
        },
        {
            id: 'varkala',
            suggestion: 'Varkala',
            questions: ['What is Varkala famous for?', 'How many days should I spend in Varkala?', 'Is Varkala good for families?', 'What can I do near Varkala Cliff?', 'Should I finish my trip in Varkala?', 'Is Varkala better than Kovalam?'],
            terms: ['varkala', 'varkala cliff', 'varkala beach', 'papanasam'],
            text: "Varkala is known for its cliff-top path, sea views, cafes, and beach. One or two nights make a relaxed finish after the backwaters. Swimming conditions change, so follow lifeguards and local warnings.",
            link: ['destination-varkala-kovalam.html', 'Explore Varkala'],
            related: ['kovalam', 'beach-safety', 'plan-7']
        },
        {
            id: 'kovalam',
            suggestion: 'Kovalam',
            questions: ['What is Kovalam famous for?', 'How many days should I spend in Kovalam?', 'Is Kovalam good for children?', 'What can I see near Kovalam lighthouse?', 'Is Kovalam better than Varkala?', 'How far is Kovalam from Thiruvananthapuram?'],
            terms: ['kovalam', 'kovalam beach', 'lighthouse beach', 'kovalam lighthouse'],
            text: "Kovalam is a convenient beach base close to Thiruvananthapuram, with lighthouse views and established hotels. Pick it for easier city and airport access; pick Varkala for the cliff setting.",
            link: ['destination-varkala-kovalam.html', 'Compare the coast'],
            related: ['varkala', 'thiruvananthapuram', 'beach-safety']
        },
        {
            id: 'thiruvananthapuram',
            suggestion: 'Thiruvananthapuram',
            questions: ['What can I see in Thiruvananthapuram?', 'Is Trivandrum worth visiting?', 'Which airport is near Varkala?', 'Can I end my Kerala trip in Trivandrum?', 'What museums are in the capital?', 'How many days do I need in Thiruvananthapuram?'],
            terms: ['thiruvananthapuram', 'trivandrum', 'kerala capital', 'capital city'],
            text: "Thiruvananthapuram is Kerala's capital and a useful gateway for Varkala and Kovalam. Add a day for museums, city heritage, and local food, or use it mainly for the airport connection.",
            link: ['travel-info.html', 'Plan the south Kerala connection'],
            related: ['airports', 'varkala', 'kovalam']
        },
        {
            id: 'kadamakkudy',
            suggestion: 'Kadamakkudy',
            questions: ['What are the Kadamakkudy Islands?', 'How do I visit Kadamakkudy?', 'Is Kadamakkudy near Kochi?', 'What time should I visit Kadamakkudy?', 'Can I cycle at Kadamakkudy?', 'Is Kadamakkudy included in a plan?'],
            terms: ['kadamakkudy', 'kadamakkudy islands', 'islands near kochi'],
            text: "Kadamakkudy is a cluster of lived-in islands near Kochi with wetlands, fishing scenes, paddy fields, and narrow village roads. Visit early, carry water, travel quietly, and avoid blocking local traffic.",
            link: ['destination-kadamakkudy.html', 'Explore Kadamakkudy'],
            related: ['offbeat', 'kochi', 'plan-7']
        },
        {
            id: 'munroe',
            suggestion: 'Munroe Island',
            questions: ['What can I do on Munroe Island?', 'Is Munroe Island worth visiting?', 'How many nights should I stay on Munroe Island?', 'Where can I take a small canoe ride?', 'Is Munroe Island better than a houseboat?', 'Can I stay in a village homestay?'],
            terms: ['munroe island', 'munro island', 'small canoe', 'ashtamudi canals'],
            text: "Munroe Island offers narrow-canal canoe trips, quiet village roads, homestays, and Ashtamudi backwater scenery. Stay one night and arrange the canoe through a reliable local host, with timing adjusted for water and weather.",
            link: ['destination-munroe-island.html', 'Explore Munroe Island'],
            related: ['backwater-choice', 'homestays', 'plan-7']
        },
        {
            id: 'valiyaparamba',
            suggestion: 'Valiyaparamba',
            questions: ['What is Valiyaparamba?', 'Where are the north Kerala islands?', 'Is Valiyaparamba worth visiting?', 'Can I combine Bekal and Valiyaparamba?', 'How do I reach Valiyaparamba?', 'What can I do near Bekal?'],
            terms: ['valiyaparamba', 'bekal', 'north kerala islands', 'kasaragod backwaters'],
            text: "Valiyaparamba is a quieter north Kerala island-backwater area that pairs well with Bekal Fort and Malabar food. It is best for the 10-day route because reaching Kasaragod from the south takes time.",
            link: ['destination-valiyaparamba.html', 'Explore Valiyaparamba'],
            related: ['plan-10', 'offbeat', 'transport']
        },
        {
            id: 'poovar',
            suggestion: 'Poovar',
            questions: ['What can I do in Poovar?', 'Is Poovar worth visiting?', 'Is Poovar near Kovalam?', 'Can I take a boat ride at Poovar?', 'Does Poovar have a beach?', 'How long should I spend in Poovar?'],
            terms: ['poovar', 'poovar island', 'neyyar estuary', 'poovar beach', 'poovar boat'],
            text: "Poovar is a southern estuary where the Neyyar River approaches the Arabian Sea. Allow half or a full day from Kovalam for a mangrove-lined boat journey and sandbar views, with tide, weather and life-jacket arrangements confirmed locally.",
            link: ['destination-poovar.html', 'Explore Poovar'],
            related: ['kovalam', 'offbeat', 'beach-safety']
        },
        {
            id: 'offbeat',
            suggestion: 'Offbeat places',
            questions: ['Which are the best offbeat places in Kerala?', 'Where can I avoid crowds?', 'Are there quiet islands in Kerala?', 'Which hidden places are included in the plans?', 'What is a less touristy Kerala route?', 'Can I visit villages and small canals?', 'Which plan includes offbeat destinations?'],
            terms: ['offbeat places', 'avoid crowds', 'hidden places', 'less touristy', 'quiet islands', 'unusual places'],
            text: "Start with Kadamakkudy near Kochi, Munroe Island near Kollam, and Valiyaparamba in north Kerala. The 7-day plan includes Kadamakkudy and Munroe; the 10-day plan adds Valiyaparamba and Bekal.",
            link: ['destination-islands.html', 'Explore offbeat islands'],
            related: ['plan-7', 'plan-10', 'responsible']
        },
        {
            id: 'houseboat',
            suggestion: 'Houseboats',
            questions: ['How do Kerala houseboats work?', 'Should I book an overnight houseboat?', 'What is included on a houseboat?', 'Are meals served on houseboats?', 'How do I choose a safe houseboat?', 'Is a day cruise better than an overnight cruise?', 'Do houseboats have bathrooms?', 'How early should I book a houseboat?'],
            terms: ['houseboat', 'overnight cruise', 'day cruise', 'boat cabin', 'house boat'],
            text: "An overnight houseboat usually boards around midday, cruises through the afternoon, anchors for the night, and includes meals before a morning return. Confirm the exact boat, cabin, bathroom, safety equipment, route, meal plan, and cancellation terms before paying.",
            link: ['destination-alappuzha.html', 'Plan an Alappuzha cruise'],
            related: ['backwater-choice', 'family', 'booking']
        },
        {
            id: 'backwater-choice',
            suggestion: 'Best backwaters',
            questions: ['Which backwater destination should I choose?', 'Is Alappuzha or Kumarakom better?', 'Is Munroe Island better than Alleppey?', 'Where can I take a small canoe?', 'Should I choose a resort or houseboat?', 'What is the quietest backwater experience?'],
            terms: ['best backwaters', 'alappuzha or kumarakom', 'munroe or alleppey', 'quiet backwaters', 'small canoe'],
            text: "Choose Alappuzha for the classic houseboat, Kumarakom for a lakeside resort and short cruises, or Munroe Island for a quieter homestay and small-canoe experience through narrow canals.",
            link: ['destination-islands.html', 'Compare backwater styles'],
            related: ['alappuzha', 'kumarakom', 'munroe']
        },
        {
            id: 'food',
            suggestion: 'Kerala food',
            questions: ['What food should I try in Kerala?', 'What is Kerala famous for eating?', 'What is a traditional Kerala breakfast?', 'Where can I try a Kerala sadya?', 'What snacks should I taste?', 'Is Kerala food very spicy?', 'What should kids try?'],
            terms: ['kerala food', 'what to eat', 'traditional breakfast', 'kerala sadya', 'local dishes', 'kerala snacks'],
            text: "Try appam with stew, puttu with kadala curry, dosa, idiyappam, Kerala-style fish curry, Malabar biryani, banana chips, and a vegetarian sadya. Ask for less chilli when needed and choose busy, clean restaurants.",
            link: ['experiences.html', 'Explore Kerala experiences'],
            related: ['vegetarian', 'seafood', 'kochi']
        },
        {
            id: 'vegetarian',
            suggestion: 'Vegetarian food',
            questions: ['Is vegetarian food easy to find in Kerala?', 'What vegetarian Kerala dishes should I try?', 'Can vegans eat well in Kerala?', 'Does Kerala food contain coconut?', 'Where can I get a vegetarian sadya?', 'Can restaurants handle food allergies?'],
            terms: ['vegetarian food', 'vegan food', 'food allergies', 'vegetarian sadya', 'veg options'],
            text: "Vegetarian food is easy to find. Try sadya, appam with vegetable stew, puttu with kadala curry, dosa, idiyappam, thoran, and avial. For vegan or allergy needs, ask clearly about dairy, ghee, coconut, nuts, and cross-contact.",
            link: ['experiences.html', 'Explore food and culture'],
            related: ['food', 'health', 'seafood']
        },
        {
            id: 'seafood',
            suggestion: 'Seafood',
            questions: ['Where can I eat good seafood in Kerala?', 'What Kerala fish dishes should I try?', 'Is seafood safe to eat?', 'What food is famous on the coast?', 'Can I eat seafood in Fort Kochi?', 'What is Malabar seafood like?'],
            terms: ['seafood', 'fish curry', 'coastal food', 'prawns', 'karimeen'],
            text: "Coastal Kerala is known for fish curry, prawns, pearl spot, and regionally different coconut-based preparations. Choose a busy restaurant, ask the price before ordering whole fish, and mention allergies clearly.",
            link: ['experiences.html', 'Explore Kerala cuisine'],
            related: ['food', 'kochi', 'valiyaparamba']
        },
        {
            id: 'culture',
            suggestion: 'Culture and shows',
            questions: ['Where can I watch Kathakali?', 'What cultural shows should I see?', 'What is Kalaripayattu?', 'Where can I see Theyyam?', 'What should I know before visiting a temple?', 'Is Kathakali suitable for children?', 'What festivals are famous in Kerala?', 'Can I watch a traditional performance in Kochi?'],
            terms: ['kathakali', 'kalaripayattu', 'theyyam', 'cultural show', 'traditional performance', 'kerala festival'],
            text: "Kathakali and Kalaripayattu shows are easy to add in Kochi or Thekkady. Theyyam is strongly associated with north Kerala and is seasonal. Dress respectfully at religious sites and verify entry rules and performance schedules locally.",
            link: ['experiences.html', 'Explore culture'],
            related: ['kochi', 'thekkady', 'official-info']
        },
        {
            id: 'beach-safety',
            suggestion: 'Beach safety',
            questions: ['Is it safe to swim at Kerala beaches?', 'Can children swim at Varkala?', 'Are there lifeguards at Kovalam?', 'Can I swim during monsoon?', 'Which Kerala beach is safest?', 'What do red flags on the beach mean?'],
            terms: ['safe to swim', 'beach safety', 'swim during monsoon', 'lifeguard', 'red flag'],
            text: "Sea conditions change quickly. Swim only in permitted areas, follow lifeguards and warning flags, keep children within reach, and avoid the water during rough monsoon conditions or after official warnings.",
            link: ['destination-varkala-kovalam.html', 'Explore Kerala beaches'],
            related: ['varkala', 'kovalam', 'family']
        },
        {
            id: 'wildlife',
            suggestion: 'Wildlife',
            questions: ['Where can I see wildlife in Kerala?', 'Will I definitely see elephants?', 'Is Periyar good for wildlife?', 'Are Wayanad safaris available?', 'Can I walk alone in forest areas?', 'How should I behave around wild animals?', 'Is a wildlife trip suitable for children?'],
            terms: ['see wildlife', 'see elephants', 'wild animals', 'forest safari', 'wildlife trip'],
            text: "Periyar and Wayanad are strong nature bases, but sightings are never guaranteed. Use authorised activities, follow guides, keep distance from animals, never feed them, and do not stop on roads to approach wildlife.",
            link: ['destination-wayanad.html', 'Explore Wayanad nature'],
            related: ['thekkady', 'wayanad', 'safety']
        },
        {
            id: 'safety',
            suggestion: 'Travel safety',
            questions: ['Is Kerala safe for tourists?', 'Is Kerala safe at night?', 'What safety precautions should I take?', 'Is Kerala safe for women?', 'How do I avoid travel scams?', 'What should I do in an emergency?', 'Are hill roads safe?', 'Can I trust local taxis?'],
            terms: ['is kerala safe', 'safety precautions', 'safe at night', 'avoid scams', 'emergency', 'safe for women'],
            text: "Use registered transport, keep valuables secure, avoid isolated areas late at night, share long-trip details, follow weather and local safety notices, and verify prices before accepting services. Call local emergency services when immediate help is needed.",
            link: ['travel-info.html', 'Open safety resources'],
            related: ['solo', 'health', 'official-info']
        },
        {
            id: 'health',
            suggestion: 'Health tips',
            questions: ['Do I need mosquito repellent in Kerala?', 'Is tap water safe to drink?', 'What health items should I pack?', 'How do I avoid travel sickness on hill roads?', 'Are leeches common in forests?', 'What should I do if I feel unwell?'],
            terms: ['mosquito', 'tap water', 'travel sickness', 'leeches', 'feel unwell', 'health tips'],
            text: "Carry insect repellent, drink sealed or reliably filtered water, use sun protection, and keep personal medicines with you. For winding hill roads, eat lightly and carry motion-sickness medicine recommended by your doctor. Seek local medical help for significant symptoms.",
            link: ['travel-info.html', 'Open practical information'],
            related: ['packing', 'safety', 'wildlife']
        },
        {
            id: 'language-money',
            suggestion: 'Language and money',
            questions: ['What language is spoken in Kerala?', 'Can people understand English?', 'What currency is used?', 'Are cards accepted in Kerala?', 'Should I carry cash?', 'Are ATMs easy to find?', 'Do I need to tip?', 'Can I use UPI as a tourist?'],
            terms: ['language spoken', 'speak english', 'currency', 'carry cash', 'cards accepted', 'atm', 'tipping', 'upi'],
            text: "Malayalam is the main language, and English is commonly understood in tourism settings. India uses the rupee. Cards and digital payments are common in towns, but carry some cash for villages, small boats, local buses, and network outages.",
            link: ['travel-info.html', 'Read Kerala travel basics'],
            related: ['connectivity', 'shopping', 'offbeat']
        },
        {
            id: 'connectivity',
            suggestion: 'Internet and mobile',
            questions: ['Will my phone work in Kerala?', 'Is mobile internet good in Kerala?', 'Do hotels have Wi-Fi?', 'Will I get signal in Munnar?', 'Can I use maps in remote places?', 'Should I download offline maps?'],
            terms: ['mobile internet', 'phone signal', 'wifi', 'wi fi', 'offline maps', 'network coverage'],
            text: "Mobile data is generally useful in towns, but signal can weaken in hills, forests, islands, and during bad weather. Download maps, tickets, hotel details, and driver numbers before long transfers.",
            link: ['travel-info.html', 'Open practical travel notes'],
            related: ['transport', 'offbeat', 'safety']
        },
        {
            id: 'responsible',
            suggestion: 'Responsible travel',
            questions: ['How can I travel responsibly in Kerala?', 'How should I behave in village areas?', 'Can I use plastic on backwater trips?', 'How do I respect local communities?', 'What should I avoid in offbeat places?', 'Can I photograph local people?'],
            terms: ['responsible travel', 'respect local', 'village etiquette', 'avoid plastic', 'local communities'],
            text: "Carry reusable water bottles, reduce single-use plastic, use local guides and stays, ask before photographing people, keep noise low, dress respectfully, and never block working village roads or waterways for pictures.",
            link: ['destination-islands.html', 'Visit island communities thoughtfully'],
            related: ['photography', 'offbeat', 'shopping']
        },
        {
            id: 'shopping',
            suggestion: 'Shopping',
            questions: ['What souvenirs should I buy in Kerala?', 'Where can I buy Kerala spices?', 'What is good to shop for in Kochi?', 'Can I buy tea in Munnar?', 'How do I avoid fake products?', 'Are handicrafts available?'],
            terms: ['souvenirs', 'buy spices', 'buy tea', 'shopping in kochi', 'handicrafts'],
            text: "Popular purchases include tea, spices, banana chips, coir products, crafts, and handloom items. Buy packaged food from reliable shops, compare quality and price, and keep receipts for higher-value purchases.",
            link: ['experiences.html', 'Explore local experiences'],
            related: ['kochi', 'munnar', 'responsible']
        },
        {
            id: 'photography',
            suggestion: 'Photography',
            questions: ['Where are the best photo spots in Kerala?', 'Can I use a drone in Kerala?', 'Can I photograph inside temples?', 'What time is best for backwater photos?', 'Can I take pictures of village life?', 'Where can I photograph tea gardens?'],
            terms: ['photo spots', 'photography', 'use a drone', 'take pictures', 'photograph people'],
            text: "Early morning and late afternoon suit tea hills, islands, beaches, and backwaters. Ask before photographing people, obey signs at religious and protected sites, and check current aviation and local rules before any drone use.",
            link: ['destinations.html', 'Find places to photograph'],
            related: ['responsible', 'munnar', 'offbeat']
        },
        {
            id: 'booking',
            suggestion: 'Booking advice',
            questions: ['How early should I book Kerala hotels?', 'When should I book a houseboat?', 'Should I pay the full amount in advance?', 'What should I check before booking?', 'Are cancellation policies important?', 'How can I avoid booking problems?'],
            terms: ['how early to book', 'before booking', 'pay in advance', 'cancellation policy', 'booking advice'],
            text: "Book earlier for December-January, long weekends, and limited-room stays. Confirm the exact room or boat, taxes, meals, pickup point, inclusions, child policy, cancellation terms, and a written payment receipt.",
            link: ['travel-info.html', 'Open booking resources'],
            related: ['hotel-prices', 'houseboat', 'official-info']
        }
    ];

    const assistantQuestionCount = assistantReplies.reduce((total, reply) => total + reply.questions.length, 0);
    const assistantHistoryKey = 'visitKeralaAssistantHistoryV2';
    const defaultAssistantSuggestions = ['choose-plan', 'best-time', 'budget-general', 'offbeat'];
    const assistantStopWords = new Set('a an and are can do does for from how i in is it me my of on or should the to we what when where which with you your'.split(' '));

    const normalizeAssistantText = text => {
        const numberWords = { three: '3', five: '5', seven: '7', ten: '10' };

        return text
            .toLowerCase()
            .replace(/'/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .map(word => numberWords[word] || word)
            .join(' ');
    };

    const getAssistantTokens = text => new Set(
        normalizeAssistantText(text)
            .split(' ')
            .filter(word => word.length > 1 && !assistantStopWords.has(word))
    );

    const readAssistantHistory = () => {
        try {
            const history = JSON.parse(sessionStorage.getItem(assistantHistoryKey));
            return Array.isArray(history) ? history.slice(-24) : [];
        } catch {
            return [];
        }
    };

    const saveAssistantHistory = item => {
        try {
            const history = [...readAssistantHistory(), item].slice(-24);
            sessionStorage.setItem(assistantHistoryKey, JSON.stringify(history));
        } catch {
            // The guide still works when browser storage is disabled.
        }
    };

    const addAssistantMessage = (kind, text, link, persist = true) => {
        const message = document.createElement('div');
        message.className = 'assistant-message ' + kind;
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

        if (persist) saveAssistantHistory({ kind, text, link: link || null });
    };

    const getAssistantEntry = id => assistantReplies.find(reply => reply.id === id);

    const renderAssistantSuggestions = ids => {
        const replies = ids
            .map(getAssistantEntry)
            .filter(Boolean)
            .slice(0, 4);

        assistantSuggestions.replaceChildren();

        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'assistant-suggestion';
            button.type = 'button';
            button.dataset.prompt = reply.questions[0];
            button.textContent = reply.suggestion;
            assistantSuggestions.append(button);
        });
    };

    const scoreAssistantReply = (reply, normalizedQuestion, questionTokens) => {
        let bestQuestionScore = 0;
        let termScore = 0;

        reply.questions.forEach(sampleQuestion => {
            const normalizedSample = normalizeAssistantText(sampleQuestion);

            if (normalizedSample === normalizedQuestion) {
                bestQuestionScore = Math.max(bestQuestionScore, 500);
                return;
            }

            if (
                normalizedQuestion.length >= 8 &&
                (normalizedQuestion.includes(normalizedSample) || normalizedSample.includes(normalizedQuestion))
            ) {
                bestQuestionScore = Math.max(bestQuestionScore, 140);
            }

            const sampleTokens = getAssistantTokens(normalizedSample);
            const overlap = [...questionTokens].filter(token => sampleTokens.has(token)).length;

            if (!overlap) return;

            const userCoverage = overlap / Math.max(questionTokens.size, 1);
            const sampleCoverage = overlap / Math.max(sampleTokens.size, 1);
            const overlapScore = (overlap * 12) + (userCoverage * 34) + (sampleCoverage * 20);
            bestQuestionScore = Math.max(bestQuestionScore, overlapScore);
        });

        const normalizedTerms = new Set(reply.terms.map(normalizeAssistantText));

        normalizedTerms.forEach(normalizedTerm => {
            const termTokens = normalizedTerm.split(' ').filter(Boolean);

            if (normalizedQuestion.includes(normalizedTerm)) {
                termScore += 34 + (termTokens.length * 8);
                return;
            }

            if (termTokens.length > 1 && termTokens.every(token => questionTokens.has(token))) {
                termScore += 24;
            }
        });

        return bestQuestionScore + termScore;
    };

    const getAssistantReply = (question) => {
        const normalizedQuestion = normalizeAssistantText(question);
        const questionTokens = getAssistantTokens(normalizedQuestion);
        const hasBudgetIntent = /(budget|cost|price|money|expensive|how much)/.test(normalizedQuestion);
        const durationRoutes = [
            { pattern: /\b3 days?\b/, plan: 'plan-3', budget: 'budget-3' },
            { pattern: /\b5 days?\b/, plan: 'plan-5', budget: 'budget-5' },
            { pattern: /\b(7 days?|one week)\b/, plan: 'plan-7', budget: 'budget-7' },
            { pattern: /\b10 days?\b/, plan: 'plan-10', budget: 'budget-10' }
        ];
        const audienceRoutes = [
            { pattern: /\b(kid|kids|child|children|family|families)\b/, id: 'family' },
            { pattern: /\b(solo|alone|female traveller|woman travelling)\b/, id: 'solo' },
            { pattern: /\b(couple|couples|honeymoon|romantic)\b/, id: 'couples' },
            { pattern: /\b(senior|seniors|elderly|older traveller)\b/, id: 'seniors' }
        ];

        if (/^(hi|hello|hey|namaste|good morning|good evening)$/.test(normalizedQuestion)) {
            return getAssistantEntry('help');
        }

        const durationRoute = durationRoutes.find(route => route.pattern.test(normalizedQuestion));
        if (durationRoute) return getAssistantEntry(hasBudgetIntent ? durationRoute.budget : durationRoute.plan);

        const audienceRoute = audienceRoutes.find(route => route.pattern.test(normalizedQuestion));
        if (audienceRoute) return getAssistantEntry(audienceRoute.id);

        const rankedReplies = assistantReplies
            .map(reply => ({ reply, score: scoreAssistantReply(reply, normalizedQuestion, questionTokens) }))
            .sort((left, right) => right.score - left.score);

        if (rankedReplies[0]?.score >= 38) return rankedReplies[0].reply;

        return {
            id: 'fallback',
            text: "I could not match that confidently yet. Ask about a specific place, trip length, budget, hotel, transport option, season, food, safety topic, houseboat, or offbeat island.",
            link: ['destinations.html', 'Browse Kerala destinations'],
            related: defaultAssistantSuggestions
        };
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
            renderAssistantSuggestions(reply.related || defaultAssistantSuggestions);
        }, 320);
    };

    const storedAssistantHistory = readAssistantHistory();

    if (storedAssistantHistory.length) {
        storedAssistantHistory.forEach(item => addAssistantMessage(item.kind, item.text, item.link, false));
    } else {
        addAssistantMessage(
            'bot',
            'Hi. I can answer ' + assistantQuestionCount + '+ common questions about Kerala plans, places, costs, stays, food, transport, weather, and safety.',
            null,
            false
        );
    }

    renderAssistantSuggestions(defaultAssistantSuggestions);

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

    assistantClear.addEventListener('click', () => {
        try {
            sessionStorage.removeItem(assistantHistoryKey);
        } catch {
            // Nothing else is needed when storage is unavailable.
        }

        assistantMessages.replaceChildren();
        addAssistantMessage(
            'bot',
            'Conversation cleared. Ask me about a Kerala place, plan, budget, hotel, route, or travel concern.',
            null,
            false
        );
        renderAssistantSuggestions(defaultAssistantSuggestions);
        assistantInput.focus();
    });

    assistantForm.addEventListener('submit', event => {
        event.preventDefault();
        askAssistant(assistantInput.value);
    });

    assistantSuggestions.addEventListener('click', event => {
        const button = event.target.closest('.assistant-suggestion');
        if (button) askAssistant(button.dataset.prompt);
    });

    window.__keralaAssistant = {
        questionCount: assistantQuestionCount,
        replyCount: assistantReplies.length,
        match: question => getAssistantReply(question).id
    };
});

document.addEventListener('DOMContentLoaded', () => {
    const finder = document.querySelector('[data-trip-finder]');
    if (!finder) return;

    const form = finder.querySelector('[data-trip-form]');
    const steps = [...finder.querySelectorAll('[data-trip-step]')];
    const backButton = finder.querySelector('[data-trip-back]');
    const nextButton = finder.querySelector('[data-trip-next]');
    const submitButton = finder.querySelector('[data-trip-submit]');
    const resetButton = finder.querySelector('[data-trip-reset]');
    const editButton = finder.querySelector('[data-trip-edit]');
    const error = finder.querySelector('[data-trip-error]');
    const result = finder.querySelector('[data-trip-result]');
    const progressBar = finder.querySelector('[data-trip-progress-bar]');
    const stepLabel = finder.querySelector('[data-trip-step-label]');
    const progressText = finder.querySelector('[data-trip-progress-text]');
    const experienceCounter = finder.querySelector('[data-experience-count]');
    const experienceLimit = finder.querySelector('[data-experience-limit]');
    const experienceInputs = [...form.querySelectorAll('input[name="experiences"]')];
    const validDays = [3, 5, 7, 10];
    const validTravellers = ['family', 'couple', 'students', 'solo', 'senior'];
    const validPaces = ['relaxed', 'balanced', 'active'];
    const validBudgets = ['value', 'comfortable', 'premium'];
    const validExperiences = ['hills', 'backwaters', 'beaches', 'wildlife', 'culture', 'food', 'wellness'];
    const durationLevels = [3, 5, 7, 10];
    const experiencePriorityWeights = [30, 20, 10];
    let currentStep = 0;
    let experiencePriority = [];

    const experienceNames = {
        hills: 'Hills',
        backwaters: 'Backwaters',
        beaches: 'Beaches',
        wildlife: 'Wildlife',
        culture: 'Culture',
        food: 'Food',
        wellness: 'Wellness'
    };

    const travellerNames = {
        family: 'Family travel',
        couple: 'Couple travel',
        students: 'Friends / students',
        solo: 'Solo travel',
        senior: 'Senior travel'
    };

    const budgetNames = {
        value: 'Value',
        comfortable: 'Comfortable',
        premium: 'Premium'
    };

    const paceNames = {
        relaxed: 'Relaxed',
        balanced: 'Balanced',
        active: 'Active'
    };

    const plans = [
        {
            id: 'three-day',
            publicName: '3-Day Kochi + Backwaters',
            days: 3,
            url: 'plan-3-days.html',
            route: 'Kochi - Fort Kochi - Alappuzha',
            pace: 'relaxed',
            travellers: ['family', 'couple', 'solo'],
            experiences: ['backwaters', 'culture', 'food'],
            budgetFit: { value: 3, comfortable: 3, premium: 2 },
            strengths: ['Short, focused route', 'Kochi heritage', 'One backwater stay'],
            limitations: ['No hill-country stay', 'No dedicated beach or wellness stay'],
            adjustments: {
                students: 'Use social stays, shared transfers and one group meeting point.',
                senior: 'Use shorter walks, private transfers and additional rest time.'
            },
            mapFrom: 'Kochi',
            mapTo: 'Alappuzha'
        },
        {
            id: 'five-day',
            publicName: '5-Day Hills + Houseboat',
            days: 5,
            url: 'plan-5-days.html',
            route: 'Kochi - Munnar - Thekkady - Alappuzha',
            pace: 'balanced',
            travellers: ['family', 'couple', 'solo'],
            experiences: ['hills', 'backwaters', 'wildlife', 'culture', 'food'],
            budgetFit: { value: 3, comfortable: 3, premium: 2.5 },
            strengths: ['Classic hill-and-water route', 'Wildlife region', 'Houseboat night'],
            limitations: ['No proper beach stay', 'No dedicated wellness stay'],
            adjustments: {
                students: 'Use shared transfers and group-friendly stays while keeping one flexible evening.',
                senior: 'Replace optional walks with viewpoints, use private transfers and add rest after hill roads.'
            },
            mapFrom: 'Kochi',
            mapTo: 'Alappuzha'
        },
        {
            id: 'seven-day',
            publicName: '7-Day Classic + Offbeat Kerala',
            days: 7,
            url: 'plan-7-days.html',
            route: 'Kochi - Kadamakkudy - Munnar - Thekkady - Munroe Island - Varkala',
            pace: 'balanced',
            travellers: ['family', 'couple', 'solo'],
            experiences: ['hills', 'backwaters', 'beaches', 'wildlife', 'culture', 'food', 'wellness'],
            budgetFit: { value: 2, comfortable: 3, premium: 3 },
            strengths: ['Famous and offbeat balance', 'Varkala coast', 'Hills and backwaters'],
            limitations: ['Several road transfers', 'More hotel changes than shorter plans'],
            adjustments: {
                students: 'Use group rooms and shared transfers, then prioritise the three most important activities.',
                senior: 'Use a private vehicle, shorten walking days and keep a rest block after each major transfer.'
            },
            mapFrom: 'Kochi',
            mapTo: 'Varkala'
        },
        {
            id: 'ten-day',
            publicName: '10-Day Kerala Deep Dive',
            days: 10,
            url: 'plan-10-days.html',
            route: 'Kochi - Kadamakkudy - Munroe Island - Munnar - Thekkady - Wayanad - Valiyaparamba - Bekal',
            pace: 'active',
            travellers: ['family', 'couple', 'solo'],
            experiences: ['hills', 'backwaters', 'beaches', 'wildlife', 'culture', 'food'],
            budgetFit: { value: 1, comfortable: 2.5, premium: 3 },
            strengths: ['North-and-south coverage', 'Multiple offbeat regions', 'Hills, wildlife and coast'],
            limitations: ['Major cross-Kerala transfers', 'No dedicated wellness programme'],
            adjustments: {
                students: 'Use overnight transport selectively and protect one lighter day after the northbound transfer.',
                senior: 'Use a private vehicle, add rest blocks and consider removing one northern stop to reduce major transfers.'
            },
            mapFrom: 'Kochi',
            mapTo: 'Bekal'
        },
        {
            id: 'student',
            publicName: '5-Day Kerala Student Plan',
            days: 5,
            url: 'plan-5-days-students.html',
            route: 'Kochi - Munnar - Alappuzha',
            pace: 'active',
            travellers: ['students'],
            experiences: ['hills', 'backwaters', 'culture', 'food'],
            budgetFit: { value: 3, comfortable: 2, premium: 1 },
            strengths: ['Group-friendly stays', 'Shared travel savings', 'Social active pace'],
            limitations: ['Shared accommodation works best for groups', 'No wildlife or beach stay'],
            adjustments: {},
            mapFrom: 'Kochi',
            mapTo: 'Alappuzha',
            specialist: 'students'
        },
        {
            id: 'senior',
            publicName: '5-Day Easy-Paced Senior Plan',
            alternativeName: '5-Day Relaxed Kochi + Kumarakom',
            days: 5,
            url: 'plan-5-days-seniors.html',
            route: 'Kochi - Kumarakom - Kochi',
            pace: 'relaxed',
            travellers: ['senior', 'couple'],
            experiences: ['backwaters', 'culture', 'food', 'wellness'],
            budgetFit: { value: 2, comfortable: 3, premium: 3 },
            strengths: ['Only two overnight bases', 'Private road transfers', 'Lighter sightseeing'],
            limitations: ['No hill-country or wildlife stay', 'Accessibility requirements must be confirmed before booking'],
            adjustments: {},
            mapFrom: 'Kochi',
            mapTo: 'Kumarakom',
            specialist: 'senior'
        }
    ];

    const paceScores = {
        relaxed: { relaxed: 6, balanced: 3, active: 0 },
        balanced: { relaxed: 3, balanced: 6, active: 3 },
        active: { relaxed: 0, balanced: 3, active: 6 }
    };

    const normaliseAnswers = rawAnswers => {
        const answers = {
            days: Number(rawAnswers.days),
            traveller: String(rawAnswers.traveller || ''),
            experiences: [...new Set(Array.isArray(rawAnswers.experiences) ? rawAnswers.experiences : [])]
                .filter(experience => validExperiences.includes(experience))
                .slice(0, 3),
            pace: String(rawAnswers.pace || ''),
            budget: String(rawAnswers.budget || '')
        };

        if (!validDays.includes(answers.days)) throw new Error('Choose a supported trip duration.');
        if (!validTravellers.includes(answers.traveller)) throw new Error('Choose a supported traveller type.');
        if (!answers.experiences.length) throw new Error('Choose at least one experience.');
        if (!validPaces.includes(answers.pace)) throw new Error('Choose a supported travel pace.');
        if (!validBudgets.includes(answers.budget)) throw new Error('Choose a supported budget.');
        return answers;
    };

    const isCoupleRelaxedRoute = answers => answers.traveller === 'couple'
        && answers.days === 5
        && answers.pace === 'relaxed'
        && answers.experiences.some(experience => ['backwaters', 'wellness'].includes(experience));

    const isPrimaryEligible = (plan, answers) => {
        if (plan.id === 'student') return answers.days === 5 && answers.traveller === 'students';
        if (plan.id === 'senior') return answers.days === 5 && (answers.traveller === 'senior' || isCoupleRelaxedRoute(answers));
        return plan.days === answers.days;
    };

    const isAlternativeEligible = (plan, answers) => {
        if (plan.id === 'student') return answers.traveller === 'students';
        if (plan.id === 'senior') return answers.traveller === 'senior' || isCoupleRelaxedRoute(answers);
        return true;
    };

    const publicPlanName = (plan, answers) => plan.id === 'senior' && answers.traveller !== 'senior'
        ? plan.alternativeName
        : plan.publicName;

    const evaluatePlan = (plan, answers) => {
        const selectedDurationIndex = durationLevels.indexOf(answers.days);
        const planDurationIndex = durationLevels.indexOf(plan.days);
        const durationGap = Math.abs(selectedDurationIndex - planDurationIndex);
        const durationScore = [40, 22, 10, 0][durationGap] ?? 0;
        const directTravellerFit = plan.travellers.includes(answers.traveller);
        const adjustableRegularFit = !plan.specialist && ['students', 'senior'].includes(answers.traveller);
        const travellerScore = directTravellerFit ? 20 : adjustableRegularFit ? 12 : 0;
        const totalExperienceWeight = answers.experiences.reduce((total, experience, index) => total + experiencePriorityWeights[index], 0);
        const matchedExperienceWeight = answers.experiences.reduce((total, experience, index) => (
            total + (plan.experiences.includes(experience) ? experiencePriorityWeights[index] : 0)
        ), 0);
        const experienceScore = totalExperienceWeight ? 30 * (matchedExperienceWeight / totalExperienceWeight) : 0;
        const paceScore = paceScores[answers.pace]?.[plan.pace] ?? 0;
        const budgetScore = (plan.budgetFit[answers.budget] / 3) * 4;
        const matchPercentage = Math.max(0, Math.min(100, Math.round(durationScore + travellerScore + experienceScore + paceScore + budgetScore)));
        const matchedExperiences = answers.experiences.filter(experience => plan.experiences.includes(experience));
        const missingExperiences = answers.experiences.filter(experience => !plan.experiences.includes(experience));
        const matchedPreferences = [];
        const missingPreferences = missingExperiences.map(experience => experienceNames[experience]);

        if (plan.days === answers.days) matchedPreferences.push(`${answers.days}-day duration`);
        else missingPreferences.push(`${answers.days}-day duration`);
        if (directTravellerFit) matchedPreferences.push(travellerNames[answers.traveller]);
        else if (adjustableRegularFit) missingPreferences.push(answers.traveller === 'senior' ? 'Dedicated senior pacing' : 'Student-group focus');
        if (plan.pace === answers.pace) matchedPreferences.push(`${paceNames[answers.pace]} pace`);
        else missingPreferences.push(`${paceNames[answers.pace]} pace`);
        if (plan.budgetFit[answers.budget] >= 2) matchedPreferences.push(`${budgetNames[answers.budget]} comfort level`);
        else missingPreferences.push(`${budgetNames[answers.budget]} comfort fit`);
        matchedPreferences.push(...matchedExperiences.map(experience => experienceNames[experience]));

        return {
            plan,
            durationGap,
            matchPercentage,
            components: {
                duration: Math.round(durationScore),
                traveller: Math.round(travellerScore),
                experiences: Math.round(experienceScore),
                pace: Math.round(paceScore),
                budget: Math.round(budgetScore)
            },
            matchedExperiences,
            missingExperiences,
            matchedPreferences: [...new Set(matchedPreferences)],
            missingPreferences: [...new Set(missingPreferences)]
        };
    };

    const formatList = values => {
        if (!values.length) return '';
        if (values.length === 1) return values[0];
        return `${values.slice(0, -1).join(', ')} and ${values.at(-1)}`;
    };

    const matchStrength = percentage => {
        if (percentage >= 90) return 'Excellent match';
        if (percentage >= 80) return 'Strong match';
        if (percentage >= 70) return 'Good match';
        if (percentage >= 60) return 'Closest available match';
        return 'Limited match';
    };

    const buildPrimaryReason = (evaluation, answers) => {
        const { plan, matchedExperiences, missingExperiences } = evaluation;
        const matchedText = formatList(matchedExperiences.map(experience => experienceNames[experience].toLowerCase()));
        const missingText = formatList(missingExperiences.map(experience => experienceNames[experience].toLowerCase()));

        if (plan.id === 'student') {
            return `This five-day student route suits a group of friends seeking an active, value-conscious trip${matchedText ? ` with ${matchedText}` : ''}. Its estimate assumes four friends share rooms and local transfers.`;
        }
        if (plan.id === 'senior' && answers.traveller === 'senior') {
            return `This five-day route uses only two overnight bases, private transfers and lighter sightseeing, making it the strongest match for a relaxed senior journey${matchedText ? ` focused on ${matchedText}` : ''}.`;
        }
        if (plan.id === 'senior') {
            return `This relaxed five-day Kochi and Kumarakom route matches your couple travel style${matchedText ? ` and interest in ${matchedText}` : ''}. The route uses two overnight bases and private transfers; use the group estimator for a total based on your actual room arrangement.`;
        }

        const durationOpening = plan.days === answers.days
            ? `This is the closest ${answers.days}-day route.`
            : `This is the closest available route, but it requires ${plan.days > answers.days ? 'extending' : 'shortening'} the trip to ${plan.days} days.`;
        const coverage = matchedText ? ` It includes ${matchedText}.` : '';
        const gap = missingText ? ` It does not fully include ${missingText}.` : '';
        const travellerAdjustment = plan.adjustments[answers.traveller] ? ` ${plan.adjustments[answers.traveller]}` : '';

        if (!missingExperiences.length && plan.pace === answers.pace && plan.travellers.includes(answers.traveller)) {
            return `This ${plan.days}-day route matches your ${travellerNames[answers.traveller].toLowerCase()}, ${paceNames[answers.pace].toLowerCase()} pace and interest in ${matchedText}. ${plan.strengths[0]} gives the trip a clear, practical structure.`;
        }
        return `${durationOpening}${coverage}${gap}${travellerAdjustment}`;
    };

    const buildPrimaryWarning = (evaluation, answers) => {
        if (evaluation.plan.id === 'ten-day' && answers.traveller === 'senior') {
            return 'The ten-day selection is respected, but this route contains major transfers. Confirm mobility needs, use private transport and consider removing one northern stop.';
        }
        if (evaluation.missingExperiences.length) {
            const missingText = formatList(evaluation.missingExperiences.map(experience => experienceNames[experience].toLowerCase()));
            if (answers.days === 3 && evaluation.missingExperiences.length > 1) {
                return `A three-day trip is too short to include all of these experiences comfortably. The closest available route does not fully include ${missingText}.`;
            }
            if (evaluation.plan.days === answers.days) {
                return `The available ${evaluation.plan.days}-day itinerary does not fully include ${missingText}.`;
            }
            return `This ${evaluation.plan.days}-day alternative does not fully include ${missingText}, and its duration differs from your selection.`;
        }
        if (evaluation.matchPercentage < 60) {
            return 'No existing itinerary fully matches these answers. Review the missing preferences or consider the alternative route.';
        }
        return '';
    };

    const alternativeUtility = (evaluation, primaryEvaluation, answers) => {
        const primaryMissing = new Set(primaryEvaluation.missingExperiences);
        const missingWeightTotal = answers.experiences.reduce((total, experience, index) => (
            total + (primaryMissing.has(experience) ? experiencePriorityWeights[index] : 0)
        ), 0);
        const recoveredWeight = answers.experiences.reduce((total, experience, index) => (
            total + (primaryMissing.has(experience) && evaluation.plan.experiences.includes(experience) ? experiencePriorityWeights[index] : 0)
        ), 0);
        const recoveryBonus = missingWeightTotal ? (recoveredWeight / missingWeightTotal) * 30 : 0;
        const specialistBonus = (answers.traveller === 'students' && evaluation.plan.id === 'student')
            || (answers.traveller === 'senior' && evaluation.plan.id === 'senior') ? 50 : 0;
        const neutralRelaxedBonus = isCoupleRelaxedRoute(answers) && evaluation.plan.id === 'senior' ? 24 : 0;
        const sameDurationBonus = evaluation.plan.days === answers.days ? 10 : 0;
        const valueShorteningBonus = answers.budget === 'value' && evaluation.plan.days < primaryEvaluation.plan.days ? 5 : 0;
        return evaluation.matchPercentage + recoveryBonus + specialistBonus + neutralRelaxedBonus + sameDurationBonus + valueShorteningBonus;
    };

    const buildAlternativeReason = (alternative, primary, answers) => {
        const { plan } = alternative;
        const direction = plan.days > answers.days ? 'Extend' : plan.days < answers.days ? 'Shorten' : 'Keep';
        if (plan.id === 'student') {
            return `${direction} to five days for a social route designed for friends or students, with shared-cost assumptions and an active pace.`;
        }
        if (plan.id === 'senior' && answers.traveller === 'senior') {
            return `${direction} to five days for a route specifically designed for senior travellers, with two bases, private transfers and lighter sightseeing.`;
        }
        if (plan.id === 'senior') {
            return 'Use the same five-day window for a more relaxed Kochi and Kumarakom route with two overnight bases and private transfers.';
        }
        const recovered = primary.missingExperiences.filter(experience => plan.experiences.includes(experience));
        if (plan.id === 'seven-day' && recovered.includes('beaches') && recovered.includes('wellness')) {
            return 'Extend to seven days to include Varkala, coastal time and wellness experiences.';
        }
        if (recovered.length) {
            return `${direction} to ${plan.days} days to include ${formatList(recovered.map(experience => experienceNames[experience].toLowerCase()))} while keeping the closest available route structure.`;
        }
        return `${direction} to ${plan.days} days for ${plan.strengths[0].toLowerCase()} and a ${paceNames[plan.pace].toLowerCase()} route.`;
    };

    const buildAlternativeDifference = (alternative, primary, answers) => {
        const dayDifference = alternative.plan.days - primary.plan.days;
        const dayText = dayDifference === 0
            ? 'Uses the same trip duration'
            : `${Math.abs(dayDifference)} ${Math.abs(dayDifference) === 1 ? 'day' : 'days'} ${dayDifference > 0 ? 'longer' : 'shorter'}`;
        const recovered = primary.missingExperiences.filter(experience => alternative.plan.experiences.includes(experience));
        const recoveredText = recovered.length
            ? ` and adds ${formatList(recovered.map(experience => experienceNames[experience].toLowerCase()))}`
            : ` with a ${paceNames[alternative.plan.pace].toLowerCase()} pace`;
        return `${dayText}${recoveredText}.`;
    };

    const recommendTrips = rawAnswers => {
        const answers = normaliseAnswers(rawAnswers);
        const exactCandidates = plans.filter(plan => plan.days === answers.days && isPrimaryEligible(plan, answers));
        const primaryCandidates = exactCandidates.length
            ? exactCandidates
            : plans.filter(plan => isPrimaryEligible(plan, answers));
        const rankedPrimary = primaryCandidates
            .map((plan, index) => ({ ...evaluatePlan(plan, answers), index }))
            .sort((left, right) => right.matchPercentage - left.matchPercentage || left.index - right.index);
        const primary = rankedPrimary[0];
        const rankedAlternatives = plans
            .filter(plan => plan.id !== primary.plan.id && isAlternativeEligible(plan, answers))
            .map((plan, index) => {
                const evaluation = evaluatePlan(plan, answers);
                return { ...evaluation, utility: alternativeUtility(evaluation, primary, answers), index };
            })
            .sort((left, right) => right.utility - left.utility || right.matchPercentage - left.matchPercentage || left.index - right.index);
        const alternative = rankedAlternatives[0];

        const primaryResult = {
            ...primary,
            id: primary.plan.id,
            name: publicPlanName(primary.plan, answers),
            url: primary.plan.url,
            selectedBudget: answers.budget,
            budgetUrl: `${primary.plan.url}?budget=${encodeURIComponent(answers.budget)}#budget`,
            explanation: buildPrimaryReason(primary, answers),
            warning: buildPrimaryWarning(primary, answers),
            mapUrl: `map.html?from=${encodeURIComponent(primary.plan.mapFrom)}&to=${encodeURIComponent(primary.plan.mapTo)}&plan=${encodeURIComponent(primary.plan.id)}`,
            strength: matchStrength(primary.matchPercentage),
            badge: primary.plan.days === answers.days ? 'Best Match' : 'Closest Alternative'
        };
        const alternativeResult = {
            ...alternative,
            id: alternative.plan.id,
            name: publicPlanName(alternative.plan, answers),
            url: alternative.plan.url,
            selectedBudget: answers.budget,
            budgetUrl: `${alternative.plan.url}?budget=${encodeURIComponent(answers.budget)}#budget`,
            reason: buildAlternativeReason(alternative, primary, answers),
            difference: buildAlternativeDifference(alternative, primary, answers)
        };

        return { answers, primary: primaryResult, alternative: alternativeResult };
    };

    const readAnswers = () => ({
        days: form.elements.days.value,
        traveller: form.elements.traveller.value,
        experiences: experiencePriority.filter(experience => form.querySelector(`input[name="experiences"][value="${experience}"]`)?.checked),
        pace: form.elements.pace.value,
        budget: form.elements.budget.value
    });

    const updateExperiencePriority = message => {
        experienceInputs.forEach(input => {
            const priority = experiencePriority.indexOf(input.value);
            if (priority >= 0) input.closest('.trip-choice').dataset.priority = String(priority + 1);
            else delete input.closest('.trip-choice').dataset.priority;
        });
        experienceCounter.textContent = `${experiencePriority.length} of 3 selected`;
        experienceLimit.textContent = message || (experiencePriority.length === 3 ? 'Maximum selected. Remove one to choose another.' : '');
    };

    const applySavedPreferences = preferences => {
        if (!preferences || typeof preferences !== 'object') return false;
        const selections = [
            ['traveller', preferences.traveller, validTravellers],
            ['pace', preferences.pace, validPaces],
            ['budget', preferences.comfort || preferences.budget, validBudgets]
        ];
        selections.forEach(([name, value, allowed]) => {
            if (!allowed.includes(value)) return;
            const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
            if (input) input.checked = true;
        });
        experienceInputs.forEach(input => { input.checked = false; });
        experiencePriority = (Array.isArray(preferences.experiences) ? preferences.experiences : [])
            .filter(experience => validExperiences.includes(experience))
            .slice(0, 3);
        experiencePriority.forEach(experience => {
            const input = form.querySelector(`input[name="experiences"][value="${experience}"]`);
            if (input) input.checked = true;
        });
        updateExperiencePriority('Preferences loaded from this device. Choose your number of travel days.');
        return true;
    };

    experienceInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked && !experiencePriority.includes(input.value)) {
                if (experiencePriority.length >= 3) {
                    input.checked = false;
                    updateExperiencePriority('Choose up to three experiences. Remove one before adding another.');
                    return;
                }
                experiencePriority.push(input.value);
            } else if (!input.checked) {
                experiencePriority = experiencePriority.filter(experience => experience !== input.value);
            }
            updateExperiencePriority('');
        });
    });

    const validateStep = index => {
        const step = steps[index];
        const checkboxes = [...step.querySelectorAll('input[type="checkbox"]')];
        const radios = [...step.querySelectorAll('input[type="radio"]')];
        const valid = checkboxes.length ? checkboxes.some(input => input.checked) : radios.some(input => input.checked);
        error.textContent = valid ? '' : (checkboxes.length ? 'Choose at least one experience to continue.' : 'Choose one option to continue.');
        if (!valid) (checkboxes[0] || radios[0])?.focus();
        return valid;
    };

    const showStep = index => {
        currentStep = index;
        steps.forEach((step, stepIndex) => {
            const active = stepIndex === currentStep;
            step.hidden = !active;
            step.classList.toggle('is-active', active);
        });
        const percentage = (currentStep + 1) * 20;
        progressBar.style.width = `${percentage}%`;
        stepLabel.textContent = `Question ${currentStep + 1} of 5`;
        progressText.textContent = `${percentage}% complete`;
        backButton.hidden = currentStep === 0;
        nextButton.hidden = currentStep === steps.length - 1;
        submitButton.hidden = currentStep !== steps.length - 1;
        error.textContent = '';
        steps[currentStep].querySelector('input:checked, input')?.focus({ preventScroll: true });
    };

    const renderChips = (target, values, emptyText) => {
        target.innerHTML = values.length
            ? values.map(value => `<span>${value}</span>`).join('')
            : `<span class="is-empty">${emptyText}</span>`;
    };

    const renderResult = recommendation => {
        const { answers, primary, alternative } = recommendation;
        const warning = finder.querySelector('[data-result-warning]');
        finder.querySelector('[data-result-badge]').textContent = primary.badge;
        finder.querySelector('[data-result-strength]').textContent = primary.strength;
        finder.querySelector('[data-result-percentage]').textContent = `${primary.matchPercentage}%`;
        finder.querySelector('[data-result-match-ring]').style.setProperty('--match', `${primary.matchPercentage * 3.6}deg`);
        finder.querySelector('[data-result-match-ring]').setAttribute('aria-label', `${primary.matchPercentage}% match, ${primary.strength}`);
        finder.querySelector('[data-result-name]').textContent = primary.name;
        finder.querySelector('[data-result-reason]').textContent = primary.explanation;
        warning.textContent = primary.warning;
        warning.hidden = !primary.warning;
        finder.querySelector('[data-result-duration]').textContent = `${primary.plan.days} days`;
        finder.querySelector('[data-result-route]').textContent = primary.plan.route;
        finder.querySelector('[data-result-pace]').textContent = paceNames[primary.plan.pace];
        finder.querySelector('[data-result-price]').textContent = `${budgetNames[answers.budget]} tier selected`;
        finder.querySelector('[data-result-price-note]').textContent = 'Your personalised trip budget depends on traveller count, ages, dates and room preferences.';
        finder.querySelector('[data-result-link]').href = primary.url;
        finder.querySelector('[data-result-budget-link]').href = primary.budgetUrl;
        finder.querySelector('[data-result-map-link]').href = primary.mapUrl;
        renderChips(finder.querySelector('[data-result-matched]'), primary.matchedPreferences, 'No strong matches');
        renderChips(finder.querySelector('[data-result-missing]'), primary.missingPreferences, 'No major gaps');

        finder.querySelector('[data-alternative-percentage]').textContent = `${alternative.matchPercentage}% match`;
        finder.querySelector('[data-alternative-name]').textContent = alternative.name;
        finder.querySelector('[data-alternative-reason]').textContent = alternative.reason;
        finder.querySelector('[data-alternative-difference]').textContent = alternative.difference;
        finder.querySelector('[data-alternative-price]').textContent = `${budgetNames[answers.budget]} comfort; calculate for your group`;
        finder.querySelector('[data-alternative-price-note]').textContent = 'The alternative plan has the same personalised group estimator.';
        finder.querySelector('[data-alternative-link]').href = alternative.url;
    };

    nextButton.addEventListener('click', () => {
        if (validateStep(currentStep)) showStep(Math.min(currentStep + 1, steps.length - 1));
    });

    backButton.addEventListener('click', () => showStep(Math.max(currentStep - 1, 0)));

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!validateStep(currentStep)) return;

        const recommendation = recommendTrips(readAnswers());
        renderResult(recommendation);
        try {
            localStorage.setItem('visitKeralaLatestRecommendation', JSON.stringify({
                id: recommendation.primary.id,
                name: recommendation.primary.name,
                matchPercentage: recommendation.primary.matchPercentage,
                route: recommendation.primary.plan.route,
                url: recommendation.primary.url,
                budgetUrl: recommendation.primary.budgetUrl,
                mapUrl: recommendation.primary.mapUrl,
                savedAt: new Date().toISOString()
            }));
        } catch {
            // The recommendation still works when browser storage is unavailable.
        }
        form.hidden = true;
        result.hidden = false;
        progressBar.style.width = '100%';
        stepLabel.textContent = 'Recommendation ready';
        progressText.textContent = 'Complete';
        result.focus();
    });

    editButton.addEventListener('click', () => {
        result.hidden = true;
        form.hidden = false;
        showStep(0);
        finder.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });

    resetButton.addEventListener('click', () => {
        form.reset();
        experiencePriority = [];
        updateExperiencePriority('');
        result.hidden = true;
        form.hidden = false;
        showStep(0);
    });

    const experienceCombinations = () => {
        const combinations = [];
        const choose = selected => {
            if (selected.length) combinations.push([...selected]);
            if (selected.length === 3) return;
            validExperiences.forEach(experience => {
                if (selected.includes(experience)) return;
                selected.push(experience);
                choose(selected);
                selected.pop();
            });
        };
        choose([]);
        return combinations;
    };

    const runAllTests = () => {
        const failures = [];
        let combinations = 0;
        const experienceSets = experienceCombinations();
        validDays.forEach(days => validTravellers.forEach(traveller => experienceSets.forEach(experiences => validPaces.forEach(pace => validBudgets.forEach(budget => {
            combinations += 1;
            const answers = { days, traveller, experiences, pace, budget };
            try {
                const recommendation = recommendTrips(answers);
                const { primary, alternative } = recommendation;
                const expectedMissing = experiences.filter(experience => !primary.plan.experiences.includes(experience));
                if (!primary || !alternative) failures.push({ answers, issue: 'Undefined recommendation' });
                else if (primary.id === alternative.id) failures.push({ answers, issue: 'Primary and alternative are identical' });
                else if (traveller === 'solo' && primary.id === 'student') failures.push({ answers, issue: 'Student plan recommended to solo traveller' });
                else if (plans.some(plan => plan.days === days && isPrimaryEligible(plan, recommendation.answers)) && primary.plan.days !== days) failures.push({ answers, issue: 'Exact duration was not respected' });
                else if (primary.matchPercentage < 0 || primary.matchPercentage > 100 || alternative.matchPercentage < 0 || alternative.matchPercentage > 100) failures.push({ answers, issue: 'Match percentage outside 0-100' });
                else if (primary.selectedBudget !== budget || alternative.selectedBudget !== budget) failures.push({ answers, issue: 'Incorrect comfort preference' });
                else if (![primary.budgetUrl, alternative.budgetUrl].every(url => url.includes(`?budget=${budget}#budget`))) failures.push({ answers, issue: 'Incorrect budget-estimator link' });
                else if (JSON.stringify(primary.missingExperiences) !== JSON.stringify(expectedMissing)) failures.push({ answers, issue: 'Missing experiences are inaccurate' });
                else if (![primary.url, alternative.url].every(url => plans.some(plan => plan.url === url))) failures.push({ answers, issue: 'Unknown plan link' });
            } catch (testError) {
                failures.push({ answers, issue: testError.message });
            }
        })))));
        return { combinations, passed: combinations - failures.length, failures };
    };

    const runRequiredTests = () => {
        const cases = [
            { id: 1, answers: { days: 3, traveller: 'family', experiences: ['backwaters', 'culture'], pace: 'relaxed', budget: 'value' }, primary: 'three-day' },
            { id: 2, answers: { days: 3, traveller: 'senior', experiences: ['backwaters', 'wellness'], pace: 'relaxed', budget: 'comfortable' }, primary: 'three-day', alternative: 'senior' },
            { id: 3, answers: { days: 3, traveller: 'students', experiences: ['hills', 'wildlife'], pace: 'active', budget: 'value' }, primary: 'three-day', alternative: 'student' },
            { id: 4, answers: { days: 5, traveller: 'students', experiences: ['hills', 'backwaters', 'food'], pace: 'active', budget: 'value' }, primary: 'student' },
            { id: 5, answers: { days: 5, traveller: 'family', experiences: ['hills', 'wildlife', 'backwaters'], pace: 'balanced', budget: 'comfortable' }, primary: 'five-day' },
            { id: 6, answers: { days: 5, traveller: 'senior', experiences: ['backwaters', 'culture', 'wellness'], pace: 'relaxed', budget: 'comfortable' }, primary: 'senior' },
            { id: 7, answers: { days: 5, traveller: 'couple', experiences: ['backwaters', 'wellness'], pace: 'relaxed', budget: 'premium' }, primary: 'senior', publicName: '5-Day Relaxed Kochi + Kumarakom' },
            { id: 8, answers: { days: 7, traveller: 'family', experiences: ['beaches', 'wellness', 'backwaters'], pace: 'relaxed', budget: 'premium' }, primary: 'seven-day' },
            { id: 9, answers: { days: 7, traveller: 'students', experiences: ['hills', 'beaches', 'culture'], pace: 'active', budget: 'value' }, primary: 'seven-day', alternative: 'student' },
            { id: 10, answers: { days: 7, traveller: 'senior', experiences: ['backwaters', 'culture'], pace: 'relaxed', budget: 'comfortable' }, primary: 'seven-day', alternative: 'senior' },
            { id: 11, answers: { days: 10, traveller: 'family', experiences: ['hills', 'wildlife', 'beaches'], pace: 'active', budget: 'premium' }, primary: 'ten-day' },
            { id: 12, answers: { days: 10, traveller: 'senior', experiences: ['backwaters', 'wellness'], pace: 'relaxed', budget: 'premium' }, primary: 'ten-day', alternative: 'senior' },
            { id: 13, answers: { days: 3, traveller: 'family', experiences: ['beaches', 'wellness'], pace: 'relaxed', budget: 'premium' }, primary: 'three-day', alternative: 'seven-day' },
            { id: 14, answers: { days: 5, traveller: 'solo', experiences: ['hills', 'wildlife'], pace: 'active', budget: 'value' }, primary: 'five-day' }
        ];

        const results = cases.map(testCase => {
            const recommendation = recommendTrips(testCase.answers);
            const issues = [];
            if (recommendation.primary.id !== testCase.primary) issues.push(`Expected primary ${testCase.primary}, received ${recommendation.primary.id}`);
            if (testCase.alternative && recommendation.alternative.id !== testCase.alternative) issues.push(`Expected alternative ${testCase.alternative}, received ${recommendation.alternative.id}`);
            if (testCase.publicName && recommendation.primary.name !== testCase.publicName) issues.push(`Expected public name ${testCase.publicName}`);
            return {
                id: testCase.id,
                passed: !issues.length,
                primary: recommendation.primary.id,
                alternative: recommendation.alternative.id,
                percentage: recommendation.primary.matchPercentage,
                issues
            };
        });

        return {
            cases: results.length,
            passed: results.filter(testCase => testCase.passed).length,
            failures: results.filter(testCase => !testCase.passed),
            results
        };
    };

    let preferencesLoaded = false;
    if (new URLSearchParams(window.location.search).get('preferences') === '1') {
        try {
            preferencesLoaded = applySavedPreferences(JSON.parse(localStorage.getItem('visitKeralaTripPreferences')));
        } catch {
            preferencesLoaded = false;
        }
    }
    if (!preferencesLoaded) updateExperiencePriority('');
    const testingApi = {
        plans: plans.map(plan => ({ ...plan })),
        recommend: recommendTrips,
        evaluate: (planId, answers) => {
            const plan = plans.find(candidate => candidate.id === planId);
            if (!plan) throw new Error('Unknown plan.');
            return evaluatePlan(plan, normaliseAnswers(answers));
        },
        applySavedPreferences,
        runAllTests,
        runRequiredTests
    };
    window.__keralaTripFinder = testingApi;

    if (new URLSearchParams(window.location.search).get('qa') === 'planfinder2') {
        const exhaustive = runAllTests();
        const required = runRequiredTests();
        finder.dataset.tripFinderQa = JSON.stringify({
            exhaustive: {
                combinations: exhaustive.combinations,
                passed: exhaustive.passed,
                failures: exhaustive.failures.slice(0, 20)
            },
            required
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = [...document.querySelectorAll('[data-destination-filter]')];
    const cards = [...document.querySelectorAll('[data-destination-category]')];
    const status = document.querySelector('[data-destination-filter-status]');
    if (!filterButtons.length || !cards.length) return;

    const applyFilter = filter => {
        const supported = filter === 'all' || filterButtons.some(button => button.dataset.destinationFilter === filter);
        const selected = supported ? filter : 'all';
        let visible = 0;
        cards.forEach(card => {
            const categories = card.dataset.destinationCategory.split(/\s+/);
            const show = selected === 'all' || categories.includes(selected);
            card.hidden = !show;
            card.setAttribute('aria-hidden', String(!show));
            if (show) visible += 1;
        });
        filterButtons.forEach(button => {
            const active = button.dataset.destinationFilter === selected;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        status.textContent = selected === 'all'
            ? `Showing all ${visible} destinations.`
            : `Showing ${visible} ${selected.replace('-', ' ')} ${visible === 1 ? 'destination' : 'destinations'}.`;
        return visible;
    };
    filterButtons.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.destinationFilter)));
    window.__keralaDestinationFilters = { apply: applyFilter, categories: filterButtons.map(button => button.dataset.destinationFilter), count: cards.length };
});

document.addEventListener('DOMContentLoaded', () => {
    const phrasePanel = document.querySelector('.travel-phrase-panel');
    if (!phrasePanel) return;

    const pronunciationFiles = new Map([
        ['Namaskaram', 'namaskaram.mp3'],
        ['Sukhamaano?', 'sukhamaano.mp3'],
        ['Nandi', 'nandi.mp3'],
        ['Dayavaai', 'dayavaai.mp3'],
        ['Kshamikkanam', 'kshamikkanam.mp3'],
        ['Chetta', 'chetta.mp3'],
        ['Evideyaanu?', 'evideyaanu.mp3'],
        ['Ithu ethra?', 'ithu-ethra.mp3'],
        ['Pokanam', 'pokanam.mp3'],
        ['Sahaayikkoo!', 'sahaayikkoo.mp3'],
        ['Chaya', 'chaya.mp3'],
        ['Vellam', 'vellam.mp3'],
        ['Bhakshanam', 'bhakshanam.mp3'],
        ['Kada', 'kada.mp3']
    ]);
    const phraseRows = [...phrasePanel.querySelectorAll('.travel-phrase-row')];
    const intro = phrasePanel.querySelector('.phrase-panel-intro');
    const status = document.createElement('p');
    status.className = 'phrase-pronunciation-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = 'Use the speaker buttons to hear each phrase at a slower learning pace.';
    intro?.insertAdjacentElement('afterend', status);

    const audioPlayer = new Audio();
    audioPlayer.preload = 'none';
    let activeButton = null;

    const buttons = phraseRows.map(row => {
        const transliteration = row.querySelector('strong span:not([lang])')?.textContent.trim() || 'this phrase';
        const audioFile = pronunciationFiles.get(transliteration);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'phrase-sound-button';
        button.disabled = !audioFile;
        button.dataset.phraseName = transliteration;
        button.dataset.audioSrc = audioFile ? `audio/malayalam/${audioFile}` : '';
        button.setAttribute('aria-label', `Hear ${transliteration} pronounced in Malayalam`);
        button.setAttribute('aria-pressed', 'false');
        button.title = audioFile ? `Hear ${transliteration} pronounced` : 'Pronunciation unavailable';
        button.innerHTML = '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>';
        row.append(button);
        return button;
    });

    const stopPlaybackState = () => {
        if (!activeButton) return;
        activeButton.classList.remove('is-speaking');
        activeButton.setAttribute('aria-pressed', 'false');
        activeButton = null;
    };

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            if (!button.dataset.audioSrc) return;

            if (activeButton === button && !audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                stopPlaybackState();
                status.textContent = `Stopped ${button.dataset.phraseName}.`;
                return;
            }

            audioPlayer.pause();
            stopPlaybackState();
            activeButton = button;
            button.classList.add('is-speaking');
            button.setAttribute('aria-pressed', 'true');
            status.textContent = `Playing ${button.dataset.phraseName}.`;

            audioPlayer.src = new URL(button.dataset.audioSrc, document.baseURI).href;
            audioPlayer.playbackRate = 0.88;
            try {
                await audioPlayer.play();
            } catch {
                stopPlaybackState();
                status.textContent = 'Pronunciation could not be played. Please check your connection and try again.';
            }
        });
    });

    audioPlayer.addEventListener('ended', () => {
        const phraseName = activeButton?.dataset.phraseName || 'the phrase';
        stopPlaybackState();
        status.textContent = `Finished ${phraseName}.`;
    });

    audioPlayer.addEventListener('error', () => {
        stopPlaybackState();
        status.textContent = 'Pronunciation could not be loaded. Please refresh the page and try again.';
    });

    phrasePanel.addEventListener('toggle', () => {
        if (!phrasePanel.open && !audioPlayer.paused) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            stopPlaybackState();
        }
    });

    window.__keralaPhraseAudio = {
        buttons: buttons.length,
        sources: buttons.map(button => button.dataset.audioSrc),
        isAvailable: () => buttons.every(button => !button.disabled)
    };
});
