class Job {
    jobNum;
    title;
    jobPage;
    posted;
    type;
    level;
    estimatedTime;
    skill;
    detail;

    constructor(jobNum, title, jobPage, posted, type, level, estimatedTime, skill, detail) {
        this.jobNum = jobNum;
        this.title = title;
        this.jobPage = jobPage;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.estimatedTime = estimatedTime;
        this.skill = skill;
        this.detail = detail;
    }

    getJobNum() {
        return this.jobNum;
    }

    getTitle() {
        return this.title;
    }

    getJobPage() {
        return this.jobPage;
    }

    getPosted() {
        return this.posted;
    }

    // standardized to seconds
    getPostedInt() {
        const splitString = this.posted.split(" ");
        let out = parseInt(splitString[0]);
        
        if(splitString[1].toLowerCase() === 'minutes'
        || splitString[1].toLowerCase() === 'minute')
            return out *= 60;
        if(splitString[1].toLowerCase() === 'hours'
        || splitString[1].toLowerCase() === 'hour')
            return out *= 3600;
        if(splitString[1].toLowerCase() === 'days'
        || splitString[1].toLowerCase() === 'day')
            return out *= 86400;
        if(splitString[1].toLowerCase() === 'weeks'
        || splitString[1].toLowerCase() === 'week')
            return out *= 604800;
        if(splitString[1].toLowerCase() === 'months'
        || splitString[1].toLowerCase() === 'month')
            return out *= 2592000;
        if(splitString[1].toLowerCase() === 'years'
        || splitString[1].toLowerCase() === 'year')
            return out *= 31536000;

        return out
    }

    getType() {
        return this.type;
    }

    getLevel() {
        return this.level;
    }

    getEstimatedTime() {
        return this.estimatedTime;
    }

    getSkill() {
        return this.skill;
    }

    getDetail() {
        return this.detail;
    }
}

let levelFilter = 'All';
let typeFilter = 'All';
let skillsFilter = 'All';

let sort = 'time';
let jobs;

const levelElement = document.getElementById('level');
const typeElement = document.getElementById('type');
const skillsElement = document.getElementById('skill');

document.getElementById('fileUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);

            jobs = jsonData.map(data => 
                new Job(data["Job No"], data["Title"], data["Job Page Link"],
                    data["Posted"], data["Type"], data["Level"], 
                    data["Estimated Time"], data["Skill"], data["Detail"]
                ));

            const levels = new Set();
            const types = new Set();
            const skills = new Set();

            jobs.forEach(job => {
                levels.add(job.getLevel());
                types.add(job.getType());
                skills.add(job.getSkill());
            });

            populateDropdown('level', levels);
            populateDropdown('type', types);
            populateDropdown('skill', skills);

            displayData();
        } catch(error) {
            alert('Invalid JSON file');
        }
    };
    reader.readAsText(file);
});

levelElement.addEventListener('click', function() {
    levelFilter = levelElement.options[levelElement.selectedIndex].text;
    displayData();
});

typeElement.addEventListener('click', function() {
    typeFilter = typeElement.options[typeElement.selectedIndex].text;
    displayData();
});

skillsElement.addEventListener('click', function() {
    skillsFilter = skillsElement.options[skillsElement.selectedIndex].text;
    displayData();
});

function populateDropdown(id, values) {
    const select = document.getElementById(id.toLowerCase());

    values.forEach(value => {
        const option = document.createElement('option');
        if(id === 'level') {
            option.value = value;
            option.textContent = value;
        }
        else if(id === 'type') {
            option.value = value;
            option.textContent = value;
        }
        else if(id === 'skill') {
            option.value = value;
            option.textContent = value;
        }
        select.appendChild(option);
    });
}

function displayData() {
    if(jobs === undefined) {
        console.log("Warning: no file uploaded");
        return;
    }

    const output = document.getElementById('jsonOutput');
    output.innerHTML = '';

    if(sort === 'time')
        jobs.sort((a, b) => a.getPostedInt() - b.getPostedInt());
    else if(sort === 'alpha')
        jobs.sort((a, b) => {
            let nameA = a.getTitle().toLowerCase();
            let nameB = b.getTitle().toLowerCase();

            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        });
    else if(sort === 'timeRev')
        jobs.sort((b, a) => a.getPostedInt() - b.getPostedInt());
    else if(sort === 'alphaRev')
        jobs.sort((b, a) => {
            let nameA = a.getTitle().toLowerCase()
            let nameB = b.getTitle().toLowerCase();

            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
            return 0;
        });

    let jobsFiltered = jobs;
    jobsFiltered = jobsFiltered.filter((job) => job.getLevel() == levelFilter
                                             || levelFilter == 'All');
    jobsFiltered = jobsFiltered.filter((job) => job.getType() == typeFilter
                                             || typeFilter == 'All');
    jobsFiltered = jobsFiltered.filter((job) => job.getSkill() == skillsFilter
                                             || skillsFilter == 'All');

    jobsFiltered.forEach(job => {

        const div = document.createElement('div');
        div.classList.add('data-item');
        div.innerHTML = `
            <hr>
            <p>${job.getTitle()} - ${job.getType()} (${job.getLevel()})</p>
        `;

        div.addEventListener('click', function() {
            alert(
                `Title: ${job.getTitle()}\n` +
                `Type: ${job.getType()}\n` + 
                `Level: ${job.getLevel()}\n` + 
                `Skill: ${job.getSkill()}\n` + 
                `Description: ${job.getDetail()}\n` + 
                `Posted: ${job.getPosted()}\n`
            );
        });
        output.appendChild(div);
    });
}

document.getElementById('applySort').addEventListener('click', function() {
    sort = document.getElementById('sortBy').value;
    displayData();
});
