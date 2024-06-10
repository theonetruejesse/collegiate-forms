"use client";

import { InvalidLink } from "@/src/components/invalidLink";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Suspense, useEffect } from "react";
import { calIdToLink } from "./links";
import { useQuery } from "@tanstack/react-query";
import { TallyC3Prefills } from "./tally";

export type Cal3Props = {
  id: string; // student id
  name: string; // student full name
  rep: string; // sales rep id
  setPrefills: (props: TallyC3Prefills) => void;
};

export const CalC3 = ({ id, name, rep }: Cal3Props) => {
  const calLink = calIdToLink.get(rep);
  const webhook = `https://hook.us1.make.com/p96owipfvhi0af2yk4i1to33r8solivk?id=${id}`;

  const { data, error, isLoading } = useQuery({
    queryKey: ["c3 cal prefills", id],
    queryFn: () => fetch(webhook).then((res) => res.json()),
  });

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      cal("on", {
        action: "bookingSuccessful",
        callback: (e) => {},
      });
    })();
  }, []);

  if (!calLink) return <InvalidLink />;
  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <InvalidLink />;

  const email = data["parentEmail"];
  const guests = data["studentEmail"];
  const smsReminderNumber = data["parentNumber"];

  if (!email || !guests || !smsReminderNumber) return <InvalidLink />;

  return (
    <Suspense fallback={<>loading...</>}>
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{
          layout: "month_view",
          name,
          email,
          id,
          guests,
          smsReminderNumber,
        }}
      />
    </Suspense>
  );
};
