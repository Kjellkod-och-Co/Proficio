const { SlashCommandBuilder, inlineCode } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("use AI to generate code!")
        .addStringOption(op => {
            return op.setName('question').setDescription('Write your IT question').setRequired(true)
        })
        .addStringOption(op => {
            return op.setName('language').setDescription('What format').setRequired(false)
        }),
    execute: async (interaction, client) => {
        const question = interaction.options._hoistedOptions[0].value;
        let language = 'text' || interaction.options._hoistedOptions[1].value;
        console.log('the language', language);
        interaction.deferReply();
        
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: question,
                temperature: 0.7,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: ["\"\"\""],
            });

            const beta = inlineCode( language ,response.data.choices[0].text);
            await interaction.editReply({ content: String(beta) });
        } catch (error) {
            console.log('Some Error', error);
        }
    },
};
