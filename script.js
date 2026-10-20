const SUPABASE_URL = "https://swxupedmojveaykwdndw.supabase.co";
const SUPABASE_KEY = "sb_publishable_Rg3s_abBfDmxswzYFWs0jw_2c2-f5Ll";
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;

if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
}

const name = document.getElementById("name").value;
const parentEmail = document.getElementById("parentEmail").value;
const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
        data: {
            name: name,
            parent_email: parentEmail
        }
    }
});

if (error) {
    alert("Signup error: " + error.message);
    return;
}

const userId = data.user.id;

alert("TeamSpark account created successfully!");


const account = {
    name: name,
    email: email,
    parentEmail: parentEmail,
    userId: userId
};
localStorage.setItem("teamSparkAccount", JSON.stringify(account));
    

alert("Account created successfully!");
window.location.href = "guide.html";

    });
}
const profileForm = document.getElementById("profileForm");

const profilePageParams =
    new URLSearchParams(window.location.search);

    if (profileForm && profilePageParams.get("view") === "account") {
        const profileButton =
            profileForm.querySelector('button[type="submit"]');
    
        if (profileButton) {
            profileButton.textContent = "Save Changes";
        }
    
        loadSavedProfile();
    }

async function loadSavedProfile() {
    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        alert("Please sign in to view your account.");
        return;
    }

    const { data: savedProfile, error: profileError } =
        await supabaseClient
            .from("profiles")
            .select("competition, interests, skills, availability")
            .eq("user_id", userData.user.id)
            .maybeSingle();

    if (profileError) {
        console.log("Profile load error:", profileError);
        alert("Could not load your saved profile.");
        return;
    }

    if (!savedProfile) {
        return;
    }

    document.getElementById("competition").value =
        savedProfile.competition || "";

    document.getElementById("interests").value =
        savedProfile.interests || "";

    document.getElementById("skills").value =
        savedProfile.skills || "";

    document.getElementById("availability").value =
        savedProfile.availability || "";
}

if (profileForm) {
    profileForm.addEventListener("submit", async function(event) {
        event.preventDefault(); 
        const { data: userData, error: userError } =
    await supabaseClient.auth.getUser();

if (userError || !userData.user) {
    alert("Please sign in first.");
    return;
}

const userId = userData.user.id;
        const competition = document.getElementById("competition").value;
        const interests = document.getElementById("interests").value
    .toLowerCase()
    .split(",")
    .map(item => item.trim());
    const skills = document.getElementById("skills").value
    .toLowerCase()
    .split(",")
    .map(item => item.trim());
        const availability = document.getElementById("availability").value;
        const account = JSON.parse(
            localStorage.getItem("teamSparkAccount")
        );
        const profile = {
            competition: competition,
            interests: interests,
            skills: skills,
            availability: availability
        };
        const { error: profileError } =
        await supabaseClient
            .from("profiles")
            .upsert({
                user_id: userId,
                name: userData.user.user_metadata.name,
                parent_email: userData.user.user_metadata.parent_email,
                competition: competition,
                interests: interests.join(", "),
                skills: skills.join(", "),
                availability: availability
            }, {
                onConflict: "user_id"
            });
    
    if (profileError) {
        alert("Profile save error: " + profileError.message);
        return;
    }
const { error: matchProfileError } =
    await supabaseClient
        .from("match_profiles")
        .upsert({
            user_id: userId,
            name: userData.user.user_metadata.name,
            competition: competition,
            interests: interests.join(", "),
            skills: skills.join(", "),
            availability: availability
        });

if (matchProfileError) {
    alert("Match profile save error: " + matchProfileError.message);
    return;
}      
localStorage.setItem("teamSparkProfile", JSON.stringify(profile));
if (profilePageParams.get("view") === "account") {
    alert("Your profile has been updated successfully!");
} else {
    window.location.href = "matches.html";
}
    });
}
const demoStudents = [
    {
        name: "Alex",
        competition: "sci-oly",
        interests: ["biology", "chemistry"],
        skills: ["research", "biology"],
        availability: "weekends"
    },

    {
        name: "Maya",
        competition: "sci-oly",
        interests: ["biology", "coding"],
        skills: ["programming", "data analysis"],
        availability: "weekends"
    },

    {
        name: "Jordan",
        competition: "vex",
        interests: ["robotics", "engineering"],
        skills: ["coding", "building"],
        availability: "weekdays"
    },

    {
        name: "Sam",
        competition: "mathcounts",
        interests: ["math", "problem solving"],
        skills: ["mental math", "logic"],
        availability: "weekends"
    },

    {
        name: "Taylor",
        competition: "science-bowl",
        interests: ["physics", "chemistry"],
        skills: ["research", "quick recall"],
        availability: "weekdays"
    },

    {
        name: "Riley",
        competition: "fll",
        interests: ["lego", "robotics"],
        skills: ["design", "presentation"],
        availability: "weekends"
    },

    {
        name: "Noah",
        competition: "sci-oly",
        interests: ["earth science", "biology"],
        skills: ["presentation", "research"],
        availability: "both"
    },

    {
        name: "Avery",
        competition: "vex",
        interests: ["coding", "engineering"],
        skills: ["programming", "CAD"],
        availability: "both"
    },

    {
        name: "Ethan",
        competition: "mathcounts",
        interests: ["math", "coding"],
        skills: ["problem solving", "speed math"],
        availability: "weekdays"
    },

    {
        name: "Zoe",
        competition: "science-bowl",
        interests: ["biology", "physics"],
        skills: ["teamwork", "quick recall"],
        availability: "weekends"
    }
    ,{
        name: "Liam",
        competition: "cac",
        interests: ["coding", "apps"],
        skills: ["javascript", "design"],
        availability: "weekends"
    },
    
    {
        name: "Emma",
        competition: "tsa",
        interests: ["engineering", "technology"],
        skills: ["cad", "presentation"],
        availability: "both"
    },
    
    {
        name: "Arjun",
        competition: "iac-science",
        interests: ["biology", "physics"],
        skills: ["quick recall", "research"],
        availability: "weekdays"
    },
    
    {
        name: "Sophia",
        competition: "model-un",
        interests: ["debate", "world issues"],
        skills: ["public speaking", "research"],
        availability: "weekends"
    },
    
    {
        name: "Daniel",
        competition: "cyberpatriot",
        interests: ["computers", "cybersecurity"],
        skills: ["linux", "networking"],
        availability: "both"
    }
    ,{
        name: "Olivia",
        competition: "iac-history",
        interests: ["history", "world history"],
        skills: ["quick recall", "research"],
        availability: "weekends"
    },
    
    {
        name: "Aiden",
        competition: "iac-geography",
        interests: ["geography", "maps"],
        skills: ["quick recall", "world knowledge"],
        availability: "both"
    },
    
    {
        name: "Mia",
        competition: "math-kangaroo",
        interests: ["math", "puzzles"],
        skills: ["logic", "problem solving"],
        availability: "weekends"
    },
    
    {
        name: "Lucas",
        competition: "amc",
        interests: ["math", "geometry"],
        skills: ["algebra", "problem solving"],
        availability: "weekdays"
    },
    
    {
        name: "Isabella",
        competition: "odyssey",
        interests: ["creativity", "building"],
        skills: ["design", "presentation"],
        availability: "weekends"
    },
    
    {
        name: "Henry",
        competition: "hackathon",
        interests: ["coding", "technology"],
        skills: ["javascript", "app design"],
        availability: "both"
    },
    
    {
        name: "Amelia",
        competition: "science-fair",
        interests: ["research", "biology"],
        skills: ["experiments", "data analysis"],
        availability: "weekends"
    },
    
    {
        name: "James",
        competition: "quiz-bowl",
        interests: ["trivia", "history"],
        skills: ["quick recall", "general knowledge"],
        availability: "weekdays"
    },
    
    {
        name: "Charlotte",
        competition: "debate",
        interests: ["debate", "current events"],
        skills: ["public speaking", "research"],
        availability: "weekends"
    },
    
    {
        name: "Benjamin",
        competition: "entrepreneurship",
        interests: ["business", "startups"],
        skills: ["marketing", "presentation"],
        availability: "both"
    }
];
function calculateMatch(user, student) {

    // Students must be interested in the same competition
    if (user.competition !== student.competition) {
        return false;
    }

    // Find interests that both students share
    const sharedInterests = user.interests.filter(
        interest => student.interests.includes(interest)
    );

    // Find skills the other student has that the user does not have
    const complementarySkills = student.skills.filter(
        skill => !user.skills.includes(skill)
    );

    // Check whether their availability works together
    const availabilityMatch =
        user.availability === student.availability ||
        user.availability === "both" ||
        student.availability === "both";

    // Send the match information back
    return {
        sharedInterests: sharedInterests,
        complementarySkills: complementarySkills,
        availabilityMatch: availabilityMatch,
    
        sharedInterestCount: sharedInterests.length,
        complementarySkillCount: complementarySkills.length
    };
}
async function loadRealStudents() {

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        console.log("No signed-in user.");
        return;
    }

    const { data: matchProfiles, error: matchError } =
        await supabaseClient
            .from("match_profiles")
            .select(
                "user_id, name, competition, interests, skills, availability"
            );

    if (matchError) {
        console.log("Match profile error:", matchError);
        return;
    }

    const realStudents = matchProfiles
        .filter(function(student) {
            return student.user_id !== userData.user.id;
        })
        .map(function(student) {

            return {
                userId: student.user_id,
                name: student.name,
                competition: student.competition,

                interests: student.interests
                    ? student.interests
                        .toLowerCase()
                        .split(",")
                        .map(item => item.trim())
                    : [],

                skills: student.skills
                    ? student.skills
                        .toLowerCase()
                        .split(",")
                        .map(item => item.trim())
                    : [],

                availability: student.availability
            };

        });

    console.log("REAL TEAMSPARK STUDENTS:", realStudents);
    displayMatches(realStudents);
}

loadRealStudents();

let demoModeEnabled = false;

const demoModeButton = document.getElementById("demoModeButton");

if (demoModeButton) {
    demoModeButton.addEventListener("click", function() {
        demoModeEnabled = !demoModeEnabled;

        if (demoModeEnabled) {
            displayMatches(demoStudents);
            demoModeButton.textContent = "View Real Teammates";
        } else {
            loadRealStudents();
            demoModeButton.textContent = "View Demo Teammates";
        }
    });
}

const matchesContainer =
    document.getElementById("matchesContainer");

function displayMatches(students) {

    const savedProfile =
        localStorage.getItem("teamSparkProfile");

    if (!savedProfile || !matchesContainer) {
        return;
    }

    const user = JSON.parse(savedProfile);

    let matchFound = false;
    let rankedMatches = [];

    students.forEach(function(student) {

        const match = calculateMatch(user, student);

        if (match) {

            matchFound = true;

            rankedMatches.push({
                student: student,
                match: match
            });
        }
    });


    rankedMatches.sort(function(a, b) {

        if (
            b.match.sharedInterestCount !==
            a.match.sharedInterestCount
        ) {
            return (
                b.match.sharedInterestCount -
                a.match.sharedInterestCount
            );
        }

        if (
            b.match.availabilityMatch !==
            a.match.availabilityMatch
        ) {
            return (
                b.match.availabilityMatch -
                a.match.availabilityMatch
            );
        }

        return (
            b.match.complementarySkillCount -
            a.match.complementarySkillCount
        );
    });


    matchesContainer.innerHTML = "";


    rankedMatches.forEach(function(item) {

        const student = item.student;
        const match = item.match;
        const firstNode = matchesContainer.childNodes.length;
        const sharedInterestsText =
            match.sharedInterests.length > 0
                ? match.sharedInterests.join(", ")
                : "None yet";

        const complementarySkillsText =
            match.complementarySkills.length > 0
                ? match.complementarySkills.join(", ")
                : "None";

        matchesContainer.innerHTML +=
            "<h2>" + student.name + "</h2>";

        matchesContainer.innerHTML +=
            "<p><strong>Why this match:</strong> " +
            match.sharedInterestCount +
            " shared interest(s), " +
            (match.availabilityMatch
                ? "compatible availability"
                : "different availability") +
            "</p>";

            matchesContainer.innerHTML +=
            "<p><strong>Shared interests:</strong></p>" +
            "<div class='interest-tags'></div>";

            matchesContainer.innerHTML +=
            "<p><strong>Complementary skills:</strong></p>" +
            "<div class='skill-tags'></div>";

            matchesContainer.innerHTML +=
            "<p class='availability-status " +
            (match.availabilityMatch ? "available" : "unavailable") +
            "'>" +
            (match.availabilityMatch
                ? "✓ Matching availability"
                : "Different availability") +
            "</p>";

            if (student.userId) {
                matchesContainer.innerHTML +=
                    "<button class='interestButton' " +
                    "data-name='" + student.name + "' " +
                    "data-user-id='" + student.userId + "'>" +
                    "I'm Interested</button>";
            } else {
                matchesContainer.innerHTML +=
                    "<p><strong>Sample Student — Demo Only</strong></p>" +
                    "<button class='interestButton' disabled>" +
                    "Demo Profile</button>";
            }

            const card = document.createElement("div");

            card.className = "teammate-card";
            
            while (matchesContainer.childNodes.length > firstNode) {
                card.appendChild(matchesContainer.childNodes[firstNode]);
            }
            
            matchesContainer.appendChild(card);
            const interestTagsContainer =
    card.querySelector(".interest-tags");

if (match.sharedInterests.length === 0) {
    interestTagsContainer.textContent = "None yet";
} else {
    match.sharedInterests.forEach(function(interest) {
        const tag = document.createElement("span");
        tag.className = "interest-tag";
        tag.textContent = interest;

        interestTagsContainer.appendChild(tag);
    });
}
const skillTagsContainer =
    card.querySelector(".skill-tags");

if (match.complementarySkills.length === 0) {
    skillTagsContainer.textContent = "None yet";
} else {
    match.complementarySkills.forEach(function(skill) {
        const tag = document.createElement("span");

        tag.className = "skill-tag";
        tag.textContent = skill;

        skillTagsContainer.appendChild(tag);
    });
}
    });


    if (!matchFound) {

        matchesContainer.innerHTML =
            "<p>No teammates found yet for this competition. Check back soon!</p>";

        return;
    }
   

    const interestButtons =
        document.querySelectorAll(".interestButton");

        interestButtons.forEach(function(button) {

            button.addEventListener("click", async function() {
        
                const selectedName = button.dataset.name;
                const recipientId = button.dataset.userId;
        
                const { data: userData, error: userError } =
                    await supabaseClient.auth.getUser();
        
                if (userError || !userData.user) {
                    alert("Please sign in first.");
                    return;
                }
        
                const requesterId = userData.user.id;
        
                const { data: requestData, error: requestError } =
                await supabaseClient
                    .from("connection_requests")
                    .insert({
                        requester_id: requesterId,
                        recipient_id: recipientId,
                        status: "pending_parent_approval"
                    })
                    .select("id")
                    .single();
        
                if (requestError) {
        
                    if (requestError.code === "23505") {
                        alert("You already sent a request to this student.");
                    } else {
                        alert(
                            "Request error: " +
                            requestError.message
                        );
                    }
        
                    return;
                }
                
                const { data: emailData, error: emailError } =
    await supabaseClient.functions.invoke(
        "send-parent-approval-email",
        {
            body: {
                requestId: requestData.id
            }
        }
    );

if (emailError) {
    console.log(
        "Parent email error:",
        emailError
    );

    alert(
        "Your request was saved, but the parent email could not be sent."
    );
}

                localStorage.setItem(
                    "selectedTeammate",
                    selectedName
                );
        
                button.textContent =
                    "Parent approval pending";
        
                button.disabled = true;
            });
        });
}
const approveButton = document.getElementById("approveButton");
if (approveButton) {
    approveButton.addEventListener("click", function() {
        alert("Parent Is Considering Your Choice.   ");
    });
}
const approvalDetails =
    document.getElementById("approvalDetails");

if (approvalDetails) {

    const urlParams =
        new URLSearchParams(window.location.search);

    const token =
        urlParams.get("token");

    if (!token) {

        approvalDetails.textContent =
            "This approval link is missing or invalid.";

    } else {

        loadParentApproval(token);
    }
}


async function loadParentApproval(token) {

    const { data, error } =
        await supabaseClient.rpc(
            "get_parent_approval_details",
            {
                p_token: token
            }
        );

    if (error) {

        console.log("Parent approval error:", error);

        approvalDetails.textContent =
            "We could not load this approval request.";

        return;
    }

    if (!data || data.length === 0) {

        approvalDetails.textContent =
            "This approval link is invalid or has expired.";

        return;
    }

    const approval = data[0];
    if (approval.approval_status !== "pending") {

        approvalDetails.textContent =
            "This request has already been reviewed. Decision: " +
            approval.approval_status + ".";
    
        document.getElementById("approveParent").disabled = true;
        document.getElementById("declineParent").disabled = true;
    
        return;
    }

    approvalDetails.textContent =
        approval.child_name +
        " wants to connect with " +
        approval.teammate_name +
        ".";
}
const approveParent =
    document.getElementById("approveParent");

const declineParent =
    document.getElementById("declineParent");


if (approveParent) {

    approveParent.addEventListener(
        "click",
        async function() {

            await respondToParent("approved");

        }
    );
}


if (declineParent) {

    declineParent.addEventListener(
        "click",
        async function() {

            await respondToParent("declined");

        }
    );
}


async function respondToParent(decision) {

    const urlParams =
        new URLSearchParams(window.location.search);

    const token =
        urlParams.get("token");

    if (!token) {
        alert("Invalid approval link.");
        return;
    }

    const { data, error } =
        await supabaseClient.rpc(
            "respond_to_parent_approval",
            {
                p_token: token,
                p_decision: decision
            }
        );

    if (error) {

        console.log(
            "Approval response error:",
            error
        );

        alert(
            "Could not save your decision."
        );

        return;
    }

    if (decision === "approved") {

        approvalDetails.textContent =
            "Connection approved.";

    } else {

        approvalDetails.textContent =
            "Connection declined.";
    }

    approveParent.disabled = true;
    declineParent.disabled = true;
}
const signinForm = document.getElementById("signinForm");

if (signinForm) {
    signinForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) {
            alert("Sign in error: " + error.message);
            return;
        }
        window.location.href = "guide.html";
    });
}   
const guideButton = document.getElementById("guideButton");

if (guideButton) {
    guideButton.addEventListener("click", async function() {

        const guideInput = document.getElementById("guideInput").value;
        const userText = guideInput.toLowerCase();

        const { data: aiData, error: aiError } =
        await supabaseClient.functions.invoke("smooth-service", {
        body: {
            userText: guideInput
        }
    });

console.log("TeamSpark AI response:", aiData);
console.log("TeamSpark AI error:", aiError);
let aiRecommendation = null;
let aiCompetitionNames = [];

if (!aiError && aiData && aiData.recommendation) {

    aiRecommendation = aiData.recommendation;

    aiCompetitionNames = [
        aiRecommendation.first.competition,
        aiRecommendation.second.competition,
        aiRecommendation.third.competition
    ];
}

        let recommendations = [];

        const guideResult = document.getElementById("guideResult");
        const continueButton = document.getElementById("continueButton");
        if (guideInput.trim() === "") {
            guideResult.textContent =
                "Tell TeamSpark what you enjoy doing first.";
            return;
        }

        function containsAny(words) {
            return words.some(function(word) {
                return userText.includes(word);
            });
        }

        if (containsAny([
            "robot",
            "robots",
            "robotics",
            "code",
            "coding",
            "program",
            "programming",
            "engineer",
            "engineering",
            "mechanical",
            "mechanics",
            "electronics",
            "electronic",
            "circuit",
            "circuits",
            "cad",
            "3d design",
            "design machines",
            "build machines",
            "building machines",
            "build robots",
            "building robots",
            "make robots",
            "competition robot"
        ])) {
            recommendations.push("VEX Robotics");
        }

        if (containsAny([
            "lego",
            "legos",
            "robot",
            "robots",
            "robotics",
            "build",
            "building",
            "design",
            "designing",
            "invent",
            "inventing",
            "innovation",
            "innovative",
            "teamwork",
            "team work",
            "presentation",
            "presenting",
            "problem solving",
            "creative",
            "creativity",
            "engineering",
            "make things",
            "building things"
        ])) {
            recommendations.push("FIRST LEGO League");
        }

        if (containsAny([
            "science",
            "biology",
            "bio",
            "chemistry",
            "chem",
            "physics",
            "earth science",
            "geology",
            "weather",
            "meteorology",
            "astronomy",
            "space",
            "stars",
            "planets",
            "anatomy",
            "body",
            "human body",
            "disease",
            "diseases",
            "health science",
            "environment",
            "environmental",
            "ecology",
            "plants",
            "animals",
            "genetics",
            "lab",
            "laboratory",
            "experiment",
            "experiments",
            "experimenting",
            "research",
            "scientific research",
            "data",
            "engineering",
            "build devices",
            "building devices",
            "science experiments"
        ])) {
            recommendations.push("Science Olympiad");
        }

        if (containsAny([
            "math",
            "mathematics",
            "algebra",
            "geometry",
            "numbers",
            "number",
            "calculation",
            "calculations",
            "calculate",
            "problem solving",
            "solve problems",
            "math problems",
            "mental math",
            "logic",
            "logical",
            "puzzle",
            "puzzles",
            "equations",
            "fractions",
            "percentages",
            "probability",
            "statistics",
            "fast math",
            "speed math"
        ])) {
            recommendations.push("MATHCOUNTS");
        }

        if (containsAny([
            "science",
            "physics",
            "chemistry",
            "biology",
            "earth science",
            "energy",
            "space",
            "astronomy",
            "science quiz",
            "science questions",
            "quiz",
            "quiz questions",
            "trivia",
            "science trivia",
            "quick recall",
            "fast questions",
            "buzzer",
            "buzzers",
            "answer questions"
        ])) {
            recommendations.push("National Science Bowl");
        }

        if (containsAny([
            "science",
            "science bee",
            "science trivia",
            "science facts",
            "science questions",
            "biology",
            "chemistry",
            "physics",
            "astronomy",
            "earth science",
            "anatomy",
            "scientists",
            "scientific facts",
            "trivia",
            "quiz",
            "buzzer",
            "quick recall"
        ])) {
            recommendations.push("IAC Science Bee");
        }

        if (containsAny([
            "history",
            "historical",
            "historical events",
            "president",
            "presidents",
            "american history",
            "us history",
            "world history",
            "ancient history",
            "ancient civilizations",
            "civilization",
            "civilizations",
            "wars",
            "war",
            "world war",
            "revolution",
            "revolutions",
            "historical people",
            "historical figures",
            "history trivia"
        ])) {
            recommendations.push("IAC History Bee");
        }

        if (containsAny([
            "geography",
            "geographic",
            "countries",
            "country",
            "capital",
            "capitals",
            "maps",
            "map",
            "flags",
            "flag",
            "continents",
            "continent",
            "oceans",
            "ocean",
            "rivers",
            "river",
            "mountains",
            "mountain",
            "cities",
            "city",
            "states",
            "world cultures",
            "places around the world",
            "world map",
            "travel"
        ])) {
            recommendations.push("IAC Geography Bee");
        }

        if (containsAny([
            "math",
            "mathematics",
            "math puzzle",
            "math puzzles",
            "puzzle",
            "puzzles",
            "logic",
            "logical",
            "patterns",
            "pattern",
            "geometry",
            "numbers",
            "problem solving",
            "brain teasers",
            "brain teaser",
            "fun math"
        ])) {
            recommendations.push("Math Kangaroo");
        }

        if (containsAny([
            "advanced math",
            "hard math",
            "challenging math",
            "competition math",
            "math competition",
            "math contests",
            "algebra",
            "geometry",
            "number theory",
            "combinatorics",
            "probability",
            "advanced problem solving",
            "difficult math problems",
            "math problems",
            "olympiad math"
        ])) {
            recommendations.push("AMC");
        }

        if (containsAny([
            "creative",
            "creativity",
            "create",
            "creating",
            "invent",
            "inventing",
            "invention",
            "build",
            "building",
            "design",
            "designing",
            "acting",
            "act",
            "theater",
            "theatre",
            "story",
            "stories",
            "storytelling",
            "performance",
            "performing",
            "problem solving",
            "creative problem solving",
            "teamwork",
            "team project",
            "make things"
        ])) {
            recommendations.push("Odyssey of the Mind");
        }

        if (containsAny([
            "debate",
            "debating",
            "countries",
            "government",
            "governments",
            "politics",
            "political",
            "world issues",
            "global issues",
            "international",
            "international relations",
            "public speaking",
            "speaking",
            "negotiation",
            "negotiating",
            "diplomacy",
            "diplomatic",
            "united nations",
            "current events",
            "world problems"
        ])) {
            recommendations.push("Model United Nations");
        }

        if (containsAny([
            "technology",
            "tech",
            "engineering",
            "engineer",
            "design",
            "designing",
            "code",
            "coding",
            "program",
            "programming",
            "architecture",
            "architect",
            "cad",
            "robot",
            "robotics",
            "computer science",
            "computers",
            "build",
            "building",
            "invent",
            "invention",
            "innovation",
            "electronics",
            "website",
            "web design",
            "video game",
            "game design"
        ])) {
            recommendations.push("Technology Student Association");
        }

        if (containsAny([
            "code",
            "coding",
            "program",
            "programming",
            "app",
            "apps",
            "application",
            "applications",
            "software",
            "software development",
            "computer science",
            "computer",
            "computers",
            "website",
            "websites",
            "web design",
            "web development",
            "javascript",
            "html",
            "css",
            "python",
            "java",
            "swift",
            "technology",
            "tech",
            "make an app",
            "build an app",
            "create an app"
        ])) {
            recommendations.push("Congressional App Challenge");
        }

        if (containsAny([
            "code",
            "coding",
            "program",
            "programming",
            "hackathon",
            "hackathons",
            "app",
            "apps",
            "software",
            "website",
            "websites",
            "computer science",
            "computer",
            "technology",
            "tech",
            "build projects",
            "building projects",
            "make projects",
            "innovation",
            "startup",
            "prototype",
            "prototypes",
            "create technology"
        ])) {
            recommendations.push("Hackathons");
        }

        if (containsAny([
            "research",
            "researching",
            "experiment",
            "experiments",
            "experimenting",
            "investigate",
            "investigation",
            "science project",
            "science projects",
            "scientific research",
            "data",
            "data analysis",
            "laboratory",
            "lab",
            "discover",
            "discovery",
            "invent",
            "invention",
            "hypothesis",
            "scientific method",
            "test ideas",
            "test a hypothesis"
        ])) {
            recommendations.push("Science Fair");
        }

        if (containsAny([
            "cyber",
            "cybersecurity",
            "cyber security",
            "computer security",
            "security",
            "hacking",
            "ethical hacking",
            "network",
            "networks",
            "networking",
            "linux",
            "windows",
            "computer networks",
            "protect computers",
            "protecting computers",
            "hackers",
            "computer systems",
            "system administration"
        ])) {
            recommendations.push("CyberPatriot");
        }

        if (containsAny([
            "trivia",
            "quiz",
            "quizzes",
            "questions",
            "general knowledge",
            "facts",
            "quick recall",
            "buzzer",
            "buzzers",
            "history",
            "literature",
            "books",
            "science",
            "geography",
            "current events",
            "art",
            "music",
            "knowledge"
        ])) {
            recommendations.push("Quiz Bowl");
        }

        if (containsAny([
            "debate",
            "debating",
            "argument",
            "arguments",
            "argue",
            "speaking",
            "public speaking",
            "speech",
            "speeches",
            "persuade",
            "persuasion",
            "persuasive",
            "current events",
            "politics",
            "research",
            "present an argument",
            "prove my point",
            "discuss issues"
        ])) {
            recommendations.push("Debate");
        }

        if (containsAny([
            "business",
            "businesses",
            "entrepreneur",
            "entrepreneurship",
            "startup",
            "startups",
            "company",
            "companies",
            "start a company",
            "create a company",
            "marketing",
            "advertising",
            "money",
            "finance",
            "business idea",
            "business ideas",
            "product",
            "products",
            "invent a product",
            "sell",
            "selling",
            "pitch",
            "pitching",
            "business pitch",
            "make money"
        ])) {
            recommendations.push("Entrepreneurship Competition");
        }
        recommendations = [...new Set(recommendations)];
        if (aiRecommendation) {

            guideResult.innerHTML =
                "<strong>Top TeamSpark Matches:</strong><br><br>" +
        
                "1. " + aiRecommendation.first.competition +
                "<br>" + aiRecommendation.first.reason +
        
                "<br><br>2. " + aiRecommendation.second.competition +
                "<br>" + aiRecommendation.second.reason +
        
                "<br><br>3. " + aiRecommendation.third.competition +
                "<br>" + aiRecommendation.third.reason;
        
            recommendations = aiCompetitionNames;
        
            continueButton.style.display = "inline-block";
        } else if (recommendations.length > 0) {
        
            guideResult.textContent =
                "Recommended: " + recommendations.join(", ");
        
            continueButton.style.display = "inline-block";
        
        } else {
        
            guideResult.textContent =
                "We couldn't find a match yet. " +
                "Try telling us more about what you enjoy.";
        
            continueButton.style.display = "none";
        }
        continueButton.onclick = function() {

            localStorage.setItem(
                "teamSparkRecommendations",
                JSON.stringify(recommendations)
            );
        
            window.location.href = "profile.html";
        };

    });
}
const savedRecommendations =
    localStorage.getItem("teamSparkRecommendations");

const competitionSelect =
    document.getElementById("competition");

if (savedRecommendations && competitionSelect) {

    const recommendations =
        JSON.parse(savedRecommendations);

        const competitionMap = {
"VEX Robotics": "vex",
"FIRST LEGO League": "fll",
"Science Olympiad": "sci-oly",
"MATHCOUNTS": "mathcounts",
"National Science Bowl": "science-bowl",
 "IAC Science Bee": "iac-science",
"IAC History Bee": "iac-history",
"IAC Geography Bee": "iac-geography",
 "Math Kangaroo": "math-kangaroo",
 "AMC": "amc",
"Odyssey of the Mind": "odyssey",
"Model United Nations": "model-un",
 "Technology Student Association": "tsa",
"Congressional App Challenge": "cac",
 "Hackathons": "hackathon",
"Science Fair": "science-fair",
"CyberPatriot": "cyberpatriot",
 "Quiz Bowl": "quiz-bowl",
"Debate": "debate",
 "Entrepreneurship Competition": "entrepreneurship"
        };

    const firstMatch = recommendations.find(function(recommendation) {
        return competitionMap[recommendation];
    });

    if (firstMatch) {
        competitionSelect.value =
            competitionMap[firstMatch];
    }
}
const chatMessages =
    document.getElementById("chatMessages");

const presetButtons =
    document.querySelectorAll(".presetMessage");

let activeChatRequestId = null;
let chatChannel = null;

if (chatMessages) {
    loadApprovedChat();
}

async function loadApprovedChat() {

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        chatMessages.textContent =
            "Please sign in to use TeamSpark Chat.";

        presetButtons.forEach(function(button) {
            button.disabled = true;
        });

        return;
    }

    const userId = userData.user.id;

    const { data: approvedRequests, error: requestError } =
    await supabaseClient
        .from("connection_requests")
        .select("id, requester_id, recipient_id, status, created_at")
        .eq("status", "approved")
        .or(
            "requester_id.eq." +
            userId +
            ",recipient_id.eq." +
            userId
        )
        .order("created_at", { ascending: false })
        .limit(1);

    if (
        requestError ||
        !approvedRequests ||
        approvedRequests.length === 0
    ) {
        chatMessages.textContent =
            "Chat will be available after both parents approve.";

        presetButtons.forEach(function(button) {
            button.disabled = true;
        });

        return;
    }

    activeChatRequestId =
        approvedRequests[0].id;

    chatMessages.textContent =
        "Connection approved. You can send a safe message.";
        await displayChatMessages();
        startChatRealtime();
}
presetButtons.forEach(function(button) {

    button.addEventListener("click", async function() {

        if (!activeChatRequestId) {
            alert("No approved connection found.");
            return;
        }

        const messageCode =
            button.dataset.code;

        const { data: userData, error: userError } =
            await supabaseClient.auth.getUser();

        if (userError || !userData.user) {
            alert("Please sign in first.");
            return;
        }

        const { error: messageError } =
            await supabaseClient
                .from("chat_messages")
                .insert({
                    request_id: activeChatRequestId,
                    sender_id: userData.user.id,
                    message_code: messageCode
                });

        if (messageError) {
            console.log(
                "Chat message error:",
                messageError
            );

            alert(
                "Could not send the message."
            );

            return;
        }

        await displayChatMessages();
    });
});
async function displayChatMessages() {

    if (!activeChatRequestId) {
        return;
    }

    const { data: messages, error: messageError } =
        await supabaseClient
            .from("chat_messages")
            .select("id, sender_id, message_code, created_at")
            .eq("request_id", activeChatRequestId)
            .order("created_at", { ascending: true });

    if (messageError) {
        console.log(
            "Load chat error:",
            messageError
        );
        return;
    }

    const messageText = {
        team_up:
            "Hi! I’m interested in teaming up.",

        event_choice:
            "What event would you like to work on?",

        weekend_available:
            "Are you available this weekend?"
    };

    chatMessages.innerHTML = "";

    const { data: userData } =
        await supabaseClient.auth.getUser();
    
    if (!userData.user) {
        chatMessages.textContent = "Please sign in.";
        return;
    }
    
    messages.forEach(function(message) {
    
        const p = document.createElement("p");
    
        const isMine =
            message.sender_id === userData.user.id;
    
        if (isMine) {
            p.className = "my-message";
            p.textContent =
                "You: " + messageText[message.message_code];
        } else {
            p.className = "teammate-message";
            p.textContent =
                "Teammate: " + messageText[message.message_code];
        }
    
        chatMessages.appendChild(p);
    
    });
    
    }
function startChatRealtime() {

    if (!activeChatRequestId) {
        return;
    }

    if (chatChannel) {
        supabaseClient.removeChannel(chatChannel);
    }

    chatChannel =
        supabaseClient
            .channel(
                "chat-" + activeChatRequestId
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter:
                        "request_id=eq." +
                        activeChatRequestId
                },
                function() {
                    displayChatMessages();
                }
            )
            .subscribe();
}

const teamSparkNavbar =
    document.getElementById("appNavbar");

if (teamSparkNavbar) {
    checkNavbarLogin();
}

async function checkNavbarLogin() {

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (!error && data.user) {
        teamSparkNavbar.hidden = false;
    }
}

const signOutButton =
    document.getElementById("signOutButton");

if (signOutButton) {
    signOutButton.addEventListener("click", async function() {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {
            alert("Could not sign out. Please try again.");
            return;
        }

        localStorage.removeItem("teamSparkProfile");
        localStorage.removeItem("selectedTeammate");
        localStorage.removeItem("teamSparkRecommendations");
        localStorage.removeItem("teamSparkAccount");

        window.location.href = "signin.html";
    });
}

const teamSparkProtectedPages = [
    "guide.html",
    "profile.html",
    "matches.html",
    "chat.html"
];

const teamSparkCurrentPage =
    window.location.pathname.split("/").pop();

if (teamSparkProtectedPages.includes(teamSparkCurrentPage)) {
    checkProtectedPage();
}

async function checkProtectedPage() {
    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.replace("signin.html");
    }
}
