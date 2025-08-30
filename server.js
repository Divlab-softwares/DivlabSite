import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
    const { name,surname, email, message } = req.body;

    try {
        // 🔹 Configure le transporteur (ici avec Gmail par ex.)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "divlabsoftware@gmail.com", // Ton email
                pass: "lwgxnqghdwiqzynq", // Mot de passe d’application lwgxnqghdwiqzynq
            },
        });

        // 🔹 Définir l’email
        await transporter.sendMail({
            from: email,
            to: "divlabsoftware@gmail.com",
            subject: `Nouveau message de ${name}`,
            text: message,
            html: `<p><strong>Nom:</strong> ${name}"  "${surname}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
        });

        res.status(200).send("Email envoyé !");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l’envoi");
    }
});

app.listen(5000, () => console.log("Serveur en ligne sur http://localhost:5000"));