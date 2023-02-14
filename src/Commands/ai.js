const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ai")
        .setDescription("use Proficio to generate code or explain something useful!")
        .addStringOption(op => {
            return op.setName('question').setDescription('Write your question').setRequired(true)
        })
        .addStringOption(op => {
            return op.setName('format').setDescription('What format shall your code be in?').setRequired(true)
        }),
    execute: async (interaction, client) => {
        const question = interaction.options._hoistedOptions[0].value;

        const userLanguage = interaction.options._hoistedOptions[1].value;

        
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

            const beta = codeBlock( userLanguage ,response.data.choices[0].text);
            await interaction.editReply({ content: String(beta) });
        } catch (error) {
            console.log(error);
            interaction.deferReply();

            await interaction.editReply({content: error.data.content});
        }
    },
};
