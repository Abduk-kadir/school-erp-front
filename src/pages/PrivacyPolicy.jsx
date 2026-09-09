import React, { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../utils/baseUrl";

const buildLogoUrl = (path) => {
  if (!path) return "";
  const trimmed = String(path).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = String(baseURL).replace(/\/$/, "");
  const rel = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${rel}`;
};

const sectionHeadingStyle = {
  textAlign: "left",
  fontWeight: 700,
  color: "#0f172a",
  margin: "24px 0 6px",
};

const hrStyle = {
  border: 0,
  borderTop: "1px solid rgba(148, 163, 184, 0.45)",
  margin: "0 0 10px",
};

const bodyStyle = {
  color: "#334155",
  fontSize: "0.98rem",
  lineHeight: 1.75,
};

const PolicySection = ({ title, children, first = false }) => (
  <>
    <h6 style={{ ...sectionHeadingStyle, margin: first ? "0 0 6px" : "24px 0 6px" }}>
      {title}
    </h6>
    <hr style={hrStyle} />
    <div style={bodyStyle}>{children}</div>
  </>
);

const PrivacyPolicy = () => {
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstitute = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${baseURL}/api/institute`);
        const list = res?.data?.data || [];
        setInstitute(Array.isArray(list) && list.length > 0 ? list[0] : null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load institute details");
        setInstitute(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitute();
  }, []);

  const logoUrl = buildLogoUrl(institute?.logo);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 14,
          border: "1px solid rgba(59, 130, 246, 0.18)",
          boxShadow: "0 12px 28px -18px rgba(30, 64, 175, 0.3)",
          padding: "36px 28px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {loading ? (
            <p style={{ color: "#64748b", margin: 0 }}>Loading...</p>
          ) : error ? (
            <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p>
          ) : logoUrl ? (
            <img
              src={logoUrl}
              alt={institute?.name || "Institute logo"}
              style={{
                maxHeight: 96,
                maxWidth: 220,
                objectFit: "contain",
              }}
            />
          ) : (
            <p style={{ color: "#64748b", margin: 0 }}>No logo available</p>
          )}
        </div>

        <PolicySection title="Privacy Policy" first>
          <p style={{ marginBottom: 16 }}>
            Digital Data System (“Company”) is a leading CRM company, incorporated in
            India, for Institute Management System through the medium of a mobile based
            Application. For the sake of brevity of understanding in this Privacy Policy
            the Company will be hereinafter referred as Digital Data System.
          </p>
          <p style={{ marginBottom: 16 }}>
            This privacy policy governs your use of the application &apos; Digital Data
            System ‘ (&quot;Application&quot;) and the other associated/ ancillary
            applications, products, websites and services managed by the Company.
          </p>
          <p style={{ marginBottom: 16 }}>
            Please read this privacy policy (&quot;Policy&quot;) carefully before using
            the Application, Website, its services and products, along with the Terms
            &amp; Conditions (&quot;T&amp;C&quot;) provided on the Application and on
            the Website. Your use of the Website, Application, services or registrations
            with us through any mode or use of any products including that of SD cards,
            tablets or other storage/transmitting device shall signify your acceptance of
            this Policy and your agreement to be legally bound by the same. For the sake
            of brevity your use of the Application in any electronic form or device shall
            be bound by the terms and conditions enumerated and agreed upon hereunder with
            wilful and free consent.
          </p>
          <p style={{ marginBottom: 0 }}>
            If you wish not to agree with any of the terms and conditions of this Policy,
            kindly refrain from using the Website, Application or its products or until
            satisfaction for you to use the same.
          </p>
        </PolicySection>

        <PolicySection title="POLICY CHANGES">
          <p style={{ marginBottom: 0 }}>
            We may occasionally update this Policy and such changes will be posted on this
            page.
          </p>
        </PolicySection>

        <PolicySection title="LINKS TO OTHER WEBSITES">
          <p style={{ marginBottom: 0 }}>
            Our Platform may contain links to other websites. Any personal information
            about you collected whilst visiting such websites is not governed by this
            Policy. We shall not be responsible for and has no control over the practices
            and content of any website accessed using the links contained on the Platform.
            This Policy shall not apply to any information you may disclose to any of our
            service providers/service personnel which we do not require you to disclose to
            us or any of our service providers under this Policy.
          </p>
        </PolicySection>

        <PolicySection title="INFORMATION WE COLLECT FROM YOU">
          <p style={{ marginBottom: 0 }}>
            We don’t collect any information from the user. As the users are already
            registered with us, the user can login in the app with their username and
            password and selecting the other details to view the app details.
          </p>
        </PolicySection>

        <PolicySection title="COOKIES">
          <p style={{ marginBottom: 0 }}>
            Digital Data System send cookies (small files containing a string of
            characters) to your computer, thereby uniquely identifying your browser.
            Cookies are used to track your preferences, help you login faster, and
            aggregated to determine user trends. This data is used to improve its
            offerings, such as providing more availability of products in areas of greater
            interest to a majority of users.
          </p>
        </PolicySection>

        <PolicySection title="DISCLOSURE AND DISTRIBUTION OF YOUR INFORMATION">
          <p style={{ marginBottom: 0 }}>
            We will only share your information with your educational institute or with
            partnes like such as payment processing companies, to process payments, etc.
          </p>
        </PolicySection>

        <PolicySection title="DATA SECURITY PRECAUTIONS">
          <p style={{ marginBottom: 16 }}>
            We have in place appropriate technical and security measures to secure the
            information we have with us.
          </p>
          <p style={{ marginBottom: 16 }}>
            We use vault and tokenization services from third party service providers to
            protect the sensitive personal information provided by you. The third-party
            service providers with respect to our vault and tokenization services and our
            payment gateway and payment processing are compliant with the payment card
            industry standard (generally referred to as PCI compliant service providers).
            You are advised not to send your full credit/debit card details through
            unencrypted electronic platforms. We ask you not to share your password with
            anyone.
          </p>
          <p style={{ marginBottom: 16 }}>
            Please we aware that the transmission of information via the internet is not
            completely secure. Although we will do our best to protect your personal data,
            we cannot guarantee the security of your data transmitted through the our
            Platform. Once we have received your information, we will use strict physical,
            electronic, and procedural safeguards to try to prevent unauthorised access.
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>1. App content :</strong> The app&apos;s content that is accessible to
            children must be appropriate for children.
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>2. App functionality :</strong> The app only provides information of
            their educational institute with is a part of their academics.
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>3. Ads :</strong> The app doesn’t display any ads.
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>4. Data practices :</strong> The app doesn’t collection of any personal
            and sensitive information from children in your app, including through APIs and
            SDKs called or used in your app. Sensitive information from children includes,
            but is not limited to, authentication information, microphone and camera sensor
            data, device data, Android ID, and ad usage data.
          </p>
          <ul style={{ marginBottom: 12, paddingLeft: 22 }}>
            <li>
              Apps doesn’t transmit Android advertising identifier (AAID), SIM Serial,
              Build Serial, BSSID, MAC, SSID, IMEI, and/or IMSI.
            </li>
            <li>
              Device phone number must not be requested from TelephonyManager of the
              Android API.
            </li>
            <li>
              Apps does not request location permission, or collect, use, and transmit
              precise location.
            </li>
          </ul>
          <p style={{ marginBottom: 8 }}>
            <strong>5. APIs and SDKs :</strong> We ensure that your app properly implements
            any APIs and SDKs.
          </p>
          <ul style={{ marginBottom: 0, paddingLeft: 22 }}>
            <li>
              Apps doesn’t contain any APIs or SDKs that are not approved for use in
              primarily child-directed services. This includes, Google Sign-In (or any
              other Google API Service that accesses data associated with a Google
              Account), Google Play Games Services, and any other API Service using OAuth
              technology for authentication and authorization.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="User Data">
          <p style={{ marginBottom: 0 }}>
            The app doesn’t collects or shares any personal or any type of data.
          </p>
        </PolicySection>

        <PolicySection title="Data provided by you">
          <p style={{ marginBottom: 0 }}>
            When you register for using the website or our services, we ask you for your
            Name, Contact Number, City / PIN Code of your Residence, Required amount of
            Loan, Type of Loan, Expected Loan Tenure. This information lets us provide
            personalized services and communicate separately with you. We also use
            aggregated information about the use of our services to evaluate our users&apos;
            preferences, improve our programming, and facilitate third party reporting of
            Internet usage.
          </p>
        </PolicySection>

        <PolicySection title="Information we collect about you and how we use that information">
          <ul style={{ marginBottom: 16, paddingLeft: 22 }}>
            <li style={{ marginBottom: 12 }}>
              <strong>With your consent:</strong> Information we collect from credit
              bureaus and customer service providers to help Digital Data System with
              customer verification and diligence required for Digital Data System
              including its authorized agencies and its partners.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Device type:</strong> With your permission, we may collect and
              monitor the type of device (including storage, hardware model, operating
              system and version, WiFi, mobile network) you use, information pertaining to
              your device including the list of accounts on your device for the purposes of
              profile enrichment. The information we collect and its usage depends on how
              you manage your privacy controls on your device.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Device Information:</strong> When you install the Application, we
              store the information we collect with unique identifiers tied to the device
              you are using. We collect information from the device when you download and
              install the Application and explicitly seek permissions from you to get the
              required information from the device.
            </li>
          </ul>
          <p style={{ marginBottom: 16 }}>
            Additionally, we also collect metadata (via the domain server through which the
            User accesses the App, search queries, IP address, crashes, date &amp; time)
            for the purpose of improvising the App functionality Further we expressly state
            that we do not access any phone call logs data.
          </p>
          <p style={{ marginBottom: 16 }}>
            In addition to the above, we also track and collect the data related to the
            performance of the Application and other diagnostic data for identifying and
            resolving any technical glitches that may be identified from such data and also
            for improving the overall functionality of the Application. We collect
            information about your device to provide automatic updates and additional
            security so that your account is not used in other people’s devices. In
            addition, the information provides us valuable feedback on your identity as a
            device holder as well as your device behaviour, thereby allowing us to improve
            our products interaction, quality of services and provide a personalised user
            experience to you.
          </p>
          <ul style={{ marginBottom: 16, paddingLeft: 22 }}>
            <li style={{ marginBottom: 12 }}>
              <strong>Camera:</strong> With your permission, We may request camera access
              to a) capture your selfie for the purpose of identity verification and b)
              scan and capture the required KYC documents in accordance with applicable
              laws.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Location:</strong> With your permission, we may receive, collect and
              analyse your location information which may be accessed through a variety of
              methods including, inter alia, GPS, IP address, and cell tower location and,
              your precise location based on GPS data. In the event of IP detection
              failure, we will collect the last cached location as your current location.
              We may collect location information for validating your address even when the
              application is closed or not in use.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Cookies and similar technologies:</strong> Cookies are small pieces
              of text sent by your web browser by a website you visit. A cookie file is
              stored in your web browser and allows the Service or a third-party to
              recognize you and make your next visit easier and the Service more useful to
              you. Cookies can be &quot;persistent&quot; or &quot;session&quot; cookies.
              Persistent cookies remain on your personal computer or mobile device when you
              go offline, while session cookies are deleted as soon as you close your web
              browser.
            </li>
          </ul>
          <p style={{ marginBottom: 12 }}>
            When you use and access the Service, we may place a number of cookies files in
            your web browser. We use cookies for the following purposes
          </p>
          <ul style={{ marginBottom: 16, paddingLeft: 22 }}>
            <li style={{ marginBottom: 8 }}>
              To enable certain functions of the Service. We use both session and
              persistent cookies on the Service and we use different types of cookies to
              run the Service:
            </li>
            <li style={{ marginBottom: 8 }}>
              Essential cookies - We may use essential cookies to authenticate users and
              prevent fraudulent use of user accounts. You can instruct your browser to
              refuse all cookies or to indicate when a cookie is being sent. However, if
              you do not accept cookies, you may not be able to use some portions of our
              Service.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Record and/or monitor calls:</strong> If you call in for a query,
              Digital Data System might for the purposes of quality checks and ongoing
              staff training record your call. Such recordings may also be used to help
              Digital Data System combat fraud.
            </li>
            <li style={{ marginBottom: 0 }}>
              <strong>Retention of information collected:</strong> The information
              collected from you will be retained during the (i) validity of your Account
              and for the purpose of submission of such information, (ii) As consented by
              you while creating your User Account (iii) As required by any regulatory
              norms including but not limited to the norms prescribed under Prevention of
              Money Laundering Act, 2002, as per State/Central Laws,
              Directions/Circulars/Notifications of NHB/RBI, and any statutory
              modification thereto, or re-enactment thereof.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="Data Retention & Deletion">
          <p style={{ marginBottom: 0 }}>
            We promise to protect your personal data from unauthorized access, misuse, and
            disclosure using the right security measures based on the type of data and how
            we are processing the same. We retain information about you to provide a
            seamless experience, to contact you in case of support required and about your
            account, to detect, mitigate, prevent, and investigate fraudulent or illegal
            activities during the course of the Services. We retain your data for as long
            as necessary based on statutory requirements and to provide you with our
            services. We may also retain and use your basic personal information inter alia
            as name, contact number, transactional details and address details as necessary
            to comply with our legal obligations, resolve disputes, send you notifications
            about dues or past dues that you owe to Digital Data System and enforce our
            agreements which shall always be in accordance with applicable laws.
          </p>
        </PolicySection>

        <PolicySection title="Sharing Of Information">
          <p style={{ marginBottom: 0 }}>
            We do not share personally identifiable data with other companies (apart from
            group companies and those companies who are our affiliates in providing our
            Service to you, who agree to use it only for that purpose and in connection
            with the business). The data that is provided shall not be given or sold to
            third parties except to statutory bodies, if so, required under law.
          </p>
        </PolicySection>

        <PolicySection title="Links">
          <p style={{ marginBottom: 0 }}>
            This Web site/application may contain links to other sites. Please be aware
            that Digital Data System is not responsible for the privacy practices of such
            other sites. We encourage our users to be aware when they leave our site and to
            read the privacy statements of each Web site that collects personal
            information. This privacy statement applies solely to information collected by
            this Web site/application.
          </p>
        </PolicySection>

        <PolicySection title="Changes In Privacy Policy">
          <p style={{ marginBottom: 0 }}>
            Our Privacy Policy might change from time to time and the updated version can
            be seen by you in our website. You are advised to review this Privacy Policy
            periodically for any changes. Changes to this Privacy Policy are effective when
            they are posted on our website.
          </p>
        </PolicySection>

        <PolicySection title="Contact Information">
          <p style={{ marginBottom: 16 }}>
            Digital Data System Grievance Officer shall undertake all reasonable efforts to
            address your grievances at the earliest possible opportunity. You may contact
            them at:
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>Address:</strong> 39, Sindhi Society, Chembur, Mumbai, Maharashtra
            400071.
          </p>
          <p style={{ marginBottom: 0 }}>
            Reach out to us on ent.ahoka@yahoo.com, in case of any queries.
          </p>
        </PolicySection>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
