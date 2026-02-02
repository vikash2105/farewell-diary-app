from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Mock API responses
    # Simulate a 401 on /me to prove we are NOT logged in
    page.route("**/api/v1/auth/me", lambda route: route.fulfill(status=401, body='{"success": false}'))

    page.route("**/api/v1/diary/test-link", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"success": true, "data": {"title": "Farewell to John", "description": "Please write a message", "isActive": true}}'
    ))

    page.route("**/api/v1/notes/test-link/check", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"success": true, "data": {"hasWritten": false, "isOwner": false}}'
    ))

    # Mock submission success to ensure frontend handles it
    page.route("**/api/v1/notes/test-link", lambda route: route.fulfill(
        status=201,
        content_type="application/json",
        body='{"success": true, "data": {"id": "123"}}'
    ))

    # Navigate to write page
    page.goto("http://localhost:5173/diary/test-link/write")

    # Wait for page to load
    page.wait_for_selector("text=Write Your Farewell Note")

    # Verify "Your Name" input is visible
    expect(page.get_by_placeholder("Enter your name")).to_be_visible()

    # Fill details
    page.get_by_placeholder("Enter your name").fill("Anonymous Friend")
    page.get_by_placeholder("Write your heartfelt message here...").fill("This is a test farewell message. Good luck on your new journey!")

    # Verify Live Preview updates
    expect(page.locator(".whitespace-pre-wrap")).to_contain_text("This is a test farewell message")
    expect(page.locator("span.font-semibold.text-gray-900").filter(has_text="Anonymous Friend")).to_be_visible()

    # Submit
    page.get_by_text("Submit Note").click()

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
