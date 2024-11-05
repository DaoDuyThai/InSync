const PrivacyPolicyPage = () => {
    return (
        <div className="container">
            <h1 className="font-bold">Privacy Policy - InSync</h1>

            <div className="section pt-5 pb-5">
                <h2 className="font-bold section pb-5">1. Information Collection and Use (PP-1.01)</h2>
                <p className="pt-2">InSync uses certain accessibility features to provide essential app functionalities. Accessibility services allow InSync to automate tasks, including but not limited to capturing screen content, enabling task automation scripts, and facilitating precise logging.</p>
                <ul>
                    <li><strong>Automated Actions and Screen Capture:</strong> InSync requires permission to access your devices accessibility settings to perform automated actions and capture screen content as part of your task automation scripts. InSync does not store or transmit sensitive information captured during these processes unless explicitly saved by the user.</li>
                    <li><strong>Log Data:</strong> InSync may collect anonymized log data related to app usage to improve performance, enhance features, and resolve issues. These logs do not include personal or sensitive user data and are securely stored.</li>
                </ul>
            </div>

            <div className="section pt-5 pb-5">
                <h2 className="font-bold section pb-5">2. Data Security (PP-2.01)</h2>
                <p className="pt-2">We implement strong security measures to protect your data from unauthorized access, disclosure, or misuse. All data within InSync, including automation logs, is encrypted and stored securely within the app environment on your device. InSync does not share your data with third parties without your explicit consent.</p>
            </div>

            <div className="section pt-5 pb-5">
                <h2 className="font-bold section pb-5">3. Use of Cloud Services (PP-3.01)</h2>
                <p className="pt-2">InSync uses Cloudinary to store and retrieve user-uploaded media files in the cloud, offering secure and reliable storage and access. Heres how we ensure your data is handled securely:</p>
                <ul>
                    <li><strong>Media File Storage:</strong> When you upload images, screenshots, or other media files to InSync, these files are securely transmitted to and stored in Cloudinary. Each file is encrypted both in transit (using HTTPS) and at rest within Cloudinary storage servers, protecting your content from unauthorized access.</li>
                    <li><strong>Access Control:</strong> Media files are stored in a way that restricts access to only the users account. No other user or third party can access your files unless you specifically choose to share them. Files uploaded to Cloudinary are linked to your unique account ID to maintain strict control over who can view or retrieve them.</li>
                    <li><strong>Retention and Deletion:</strong> InSync does not retain uploaded files beyond their required use for app functionalities. Files can be deleted at any time by the user from within the app, at which point InSync initiates a deletion request to Cloudinary to ensure the file is removed permanently from cloud storage.</li>
                    <li><strong>Third-Party Privacy:</strong> Cloudinary, as a third-party service provider, operates under its own privacy policy regarding data handling. We recommend reviewing Cloudinarys Privacy Policy to understand their specific data protection practices. While InSync integrates with Cloudinary, we do not control or manage their data processing policies beyond the secure transmission and retrieval of your files.</li>
                </ul>
                <p className="pt-2">We are committed to ensuring that all data related to your media files is handled with strict confidentiality, and access is restricted only to services essential to the functionality of InSync.</p>
            </div>

            <div className="section pt-5 pb-5">
                <h2 className="font-bold section pb-5">4. Third-Party Integrations (PP-4.01)</h2>
                <p className="pt-2">InSync may utilize third-party libraries and services to enhance app performance and functionality. These integrations help us deliver a better user experience while ensuring the reliability and security of our services. Below are the key third-party services we use:</p>
                <ul>
                    <li><strong>Firebase:</strong> Firebase helps us understand user engagement, identify issues, and improve the app performance. Firebase may collect anonymized usage data, such as app interactions and device information. For details on how Firebase handles your information, please refer to Firebase Privacy Policy.</li>
                </ul>
            </div>

            <div className="section pt-5 pb-5">
                <h2 className="font-bold section pb-5">5. Data Retention (PP-5.01)</h2>
                <p className="pt-2">At InSync, we are committed to ensuring that your data is managed responsibly. Our data retention practices are designed to balance your needs for functionality with your right to privacy. Heres how we handle data retention:</p>
                <ul>
                    <li><strong>Retention Period:</strong> InSync retains your data only for as long as necessary to fulfill the purposes for which it was collected. This includes maintaining functionality for automation scripts, logging activities, and storing media files. Specific data, such as task logs and captured content, will be retained in accordance with your usage of the app.</li>
                    <li><strong>User Control:</strong> Users have the ability to manage their data directly within the app. You can view, modify, or delete automation scripts and logs at any time. Media files uploaded to Cloudinary can also be deleted through the app, ensuring that you maintain control over your stored content.</li>
                    <li><strong>Deletion Process:</strong> If you choose to delete your data, InSync will initiate the deletion process promptly. For locally stored data, once deleted, it will be removed from your device and will no longer be accessible within the app. For files stored in Cloudinary, we will send a deletion request to remove your files permanently from their servers.</li>
                    <li><strong>Anonymized Data:</strong> InSync may retain anonymized or aggregated data that does not identify you personally for analysis and improvement of our services. This data helps us understand user trends and enhance app performance without compromising your privacy.</li>
                    <li><strong>Legal Obligations:</strong> In some cases, we may be required to retain certain information for legal or compliance reasons. In such instances, we will securely store your information as mandated by applicable laws while ensuring that access is limited to authorized personnel.</li>
                </ul>
            </div>

            <div className="section pt-5 pb-5">
                <h2 className="font-bold section pb-5">6. User Control and Consent (PP-6.01)</h2>
                <p className="pt-2">At InSync, we recognize the importance of your privacy and are committed to respecting your rights regarding your personal data. You have specific rights under applicable data protection laws, and we want to ensure that you are informed about these rights:</p>
                <ul>
                    <li><strong>Right to Access:</strong> You have the right to request access to the personal information we hold about you. This allows you to receive a copy of the data we process and understand how it is being used.</li>
                    <li><strong>Right to Rectification:</strong> If you believe that any information we hold about you is inaccurate or incomplete, you have the right to request its correction. We strive to keep our records accurate and up to date.</li>
                    <li><strong>Right to Erasure:</strong> You have the right to request the deletion of your personal data when it is no longer necessary for the purposes for which it was collected, or if you withdraw your consent for processing. We will act upon such requests in accordance with legal requirements.</li>
                    <li><strong>Right to Restrict Processing:</strong> You may request that we restrict the processing of your personal data under certain conditions, such as if you contest the accuracy of the data or if you believe that processing is unlawful.</li>
                    <li><strong>Right to Data Portability:</strong> You have the right to request the transfer of your personal data to another service provider, where technically feasible. This allows you to move, copy, or transfer your data easily.</li>
                    <li><strong>Right to Withdraw Consent:</strong> Where we rely on your consent to process your personal data, you have the right to withdraw that consent at any time. This will not affect the lawfulness of processing based on consent before its withdrawal.</li>
                </ul>
            </div>

            <div className="section pt-5 pb-5">
                <h2 className="font-bold section pb-5">7. Contact Us (PP-7.01)</h2>
                <p className="pt-2">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, we encourage you to reach out to us. Your feedback is vital for us to maintain transparency and improve our services. Heres how you can contact us:</p>
                <p className="contact">Email: <a href="mailto:buiquangminh731@gmail.com">buiquangminh731@gmail.com</a>. Please include your name, contact information, and a brief description of your inquiry or concern, and we will respond to you as soon as possible.</p>
            </div>

        </div>
    )
}

export default PrivacyPolicyPage 