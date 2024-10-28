import {render, screen, fireEvent} from "@testing-library/react"
import { Hero } from "./Hero"
import { act } from "@testing-library/react"

describe("Test component", () => {
  // test ("render Hero", () => {
  //   render(<Hero/>)

  //   expect(screen.getByText("Привет")).toBeInTheDocument()
  // })

  it("updates state with delay - RTL async utils", async () => {
    render(<Hero />);

    let label = await screen.findByLabelText("false")
    expect(label).toBeInTheDocument();
    screen.debug();

    fireEvent.click(label);

    expect(await screen.findByLabelText("true", {}, { timeout: 2000 })).toBeInTheDocument();
    // await waitFor(() => screen.getByLabelText("true"), { timeout: 2000 });
    screen.debug()
  });
})
