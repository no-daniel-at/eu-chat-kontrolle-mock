from PIL import Image, ImageSequence
import os

def process_single_gif(input_path, output_base, generate_reversed=True):
    try:
        with Image.open(input_path) as im:
            frames = []
            
            for frame in ImageSequence.Iterator(im):
                frame = frame.convert("RGBA")
                datas = frame.getdata()
                
                new_data = []
                for item in datas:
                    # Check if pixel is Black or White (strict)
                    is_black = item[0] < 50 and item[1] < 50 and item[2] < 50
                    is_white = item[0] > 200 and item[1] > 200 and item[2] > 200
                    
                    if is_black or is_white:
                        new_data.append(item)
                    else:
                        new_data.append((255, 255, 255, 0))
                
                frame.putdata(new_data)
                frames.append(frame)
            
            # 1. Save Forward Processed GIF
            processed_path = output_base + "_processed.gif"
            frames[0].save(
                processed_path,
                save_all=True,
                append_images=frames[1:],
                optimize=False,
                duration=im.info.get('duration', 100),
                disposal=2
            )
            print(f"Created {processed_path}")
            
            # 2. Save Reversed Processed GIF
            if generate_reversed:
                reversed_path = output_base + "_reversed.gif"
                reversed_frames = frames[::-1]
                reversed_frames[0].save(
                    reversed_path,
                    save_all=True,
                    append_images=reversed_frames[1:],
                    optimize=False,
                    duration=im.info.get('duration', 100),
                    disposal=2
                )
                print(f"Created {reversed_path}")

            # 3. Save First Frame (Static/Idle)
            static_path = output_base + "_static.png"
            frames[0].save(static_path)
            print(f"Created {static_path}")

            # 4. Save Last Frame (Hold)
            last_path = output_base + "_last.png"
            frames[-1].save(last_path)
            print(f"Created {last_path}")

    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    assets = [
        {"input": "public/blink_10.gif", "base": "public/blink_10", "reverse": False},
        {"input": "public/middle_down_10.gif", "base": "public/middle_down_10", "reverse": True},
        {"input": "public/middle_left_12.gif", "base": "public/middle_left_12", "reverse": True},
        {"input": "public/middle_right_12.gif", "base": "public/middle_right_12", "reverse": True},
    ]

    for asset in assets:
        if os.path.exists(asset["input"]):
            print(f"Processing {asset['input']}...")
            process_single_gif(asset["input"], asset["base"], asset["reverse"])
        else:
            print(f"Skipping {asset['input']} (not found)")

