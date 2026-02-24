// Simulate API delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const fakeApi = {
    async fetchOpportunities(data) {
        await delay(600);
        return [...data];
    },

    async fetchOpportunityById(data, id) {
        await delay(400);
        return data.find(item => item.id === id) || null;
    },

    async fetchEvents(data) {
        await delay(600);
        return [...data];
    },

    async fetchEventById(data, id) {
        await delay(400);
        return data.find(item => item.id === id) || null;
    },

    async fetchSubmissions(data) {
        await delay(500);
        return [...data];
    },

    async submitIdea(submission) {
        await delay(1200);
        return { success: true, data: submission };
    },

    async registerForEvent(eventId, registration) {
        await delay(800);
        return { success: true, eventId, registration };
    },

    async updateSubmissionStatus(submissionId, status, comment) {
        await delay(600);
        return { success: true, submissionId, status, comment };
    },

    async sendContactMessage(message) {
        await delay(1000);
        return { success: true, message };
    }
};
