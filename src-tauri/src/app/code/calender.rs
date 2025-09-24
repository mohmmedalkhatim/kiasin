use google_calendar3::CalendarHub;
use yup_oauth2::{read_service_account_key, ServiceAccountAuthenticator};
use tokio;

#[tokio::main]
async fn main() {
    let secret = read_service_account_key("service-account.json").await.unwrap();
    let auth = ServiceAccountAuthenticator::builder(secret)
        .build()
        .await
        .unwrap();

    let hub = CalendarHub::new(hyper::Client::new(), auth);

    let event = google_calendar3::api::Event {
        summary: Some("Team Meeting".to_string()),
        start: Some(google_calendar3::api::EventDateTime {
            date_time: Some("2025-09-25T09:00:00-07:00".to_string()),
            time_zone: Some("America/Los_Angeles".to_string()),
            ..Default::default()
        }),
        end: Some(google_calendar3::api::EventDateTime {
            date_time: Some("2025-09-25T10:00:00-07:00".to_string()),
            time_zone: Some("America/Los_Angeles".to_string()),
            ..Default::default()
        }),
        ..Default::default()
    };

    let result = hub.events().insert(event, "primary").doit().await;
    println!("{:?}", result);
}
