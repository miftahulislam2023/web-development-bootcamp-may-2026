import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from "@react-email/components";
import type { EmailData, EmailTemplateProps } from "./types";

function MonthlyReport({ userName, data }: { userName: string; data: EmailData }) {
  return (
    <Html>
      <Head />
      <Preview>Your Monthly Financial Report - {data.month ?? ""}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Heading>Hi {userName},</Heading>
          <Text>Here is your monthly report for {data.month}.</Text>
          <Section>
            <Text>Income: ${data.stats?.totalIncome?.toFixed(2)}</Text>
            <Text>Expenses: ${data.stats?.totalExpenses?.toFixed(2)}</Text>
          </Section>
          {data.insights && data.insights.length > 0 && (
            <>
              <Hr />
              <Heading as="h3">AI Insights</Heading>
              {data.insights.map((insight, i) => (
                <Text key={i}>• {insight}</Text>
              ))}
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

function BudgetAlert({ userName, data }: { userName: string; data: EmailData }) {
  return (
    <Html>
      <Head />
      <Preview>Budget Alert - {data.accountName ?? ""}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Heading>Hi {userName},</Heading>
          <Text>Budget alert for {data.accountName}!</Text>
          <Section>
            <Text>
              You&apos;ve used {data.percentageUsed?.toFixed(0)}% of your budget
              (${data.totalExpenses} of ${data.budgetAmount}).
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default function EmailTemplate({ userName, type, data }: EmailTemplateProps) {
  if (type === "monthly-report") {
    return <MonthlyReport userName={userName} data={data} />;
  }
  return <BudgetAlert userName={userName} data={data} />;
}
