import reflex as rx

config = rx.Config(
    app_name="briefing_station",
    db_url="sqlite:///briefing_station.db",
    env=rx.Env.DEV,
    frontend_port=3005,
    backend_port=8005,
)
