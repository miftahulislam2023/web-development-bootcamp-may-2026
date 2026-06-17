/**
 * Generates an HTML page for OAuth authentication failures.
 * @param {string} message The user-facing error message.
 * @param {string} loginPageUrl The URL of your frontend's login page.
 * @returns {string} The complete HTML string for the error page.
 */
export const getAuthErrorPageHtml = (message: string, loginPageUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authentication Failed</title>
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    /* Base Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Ubuntu', sans-serif;
      background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      padding: 40px 30px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .container:hover {
      transform: translateY(-3px);
    }

    h1 {
      color: #d9534f;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    p {
      font-size: 1rem;
      color: #555;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .message {
      font-weight: 500;
      color: #333;
    }

    .button {
      display: inline-block;
      background-color: #007bff;
      color: #fff;
      padding: 12px 28px;
      font-size: 1rem;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s ease;
      margin-top: 25px;
    }

    .button:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    .button:active {
      transform: translateY(0);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      h1 {
        font-size: 1.8rem;
      }
      p {
        font-size: 0.95rem;
      }
      .button {
        padding: 10px 24px;
        font-size: 0.95rem;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 30px 20px;
      }
      h1 {
        font-size: 1.5rem;
      }
      p {
        font-size: 0.9rem;
      }
      .button {
        padding: 10px 20px;
        font-size: 0.9rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Authentication Failed!</h1>
    <p class="message">${message}</p>
    <p>Please return to the login page and try again.</p>
    <a href="${loginPageUrl}" class="button">Go to Login Page</a>
  </div>
</body>
</html>
`;
